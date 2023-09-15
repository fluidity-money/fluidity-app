import type { Token } from "~/util/chainUtils/tokens";

import {
  Transaction as SolanaTxn,
  TransactionInstruction,
  PublicKey,
  SendTransactionError,
  Connection,
} from "@solana/web3.js";
import { getATAAddressSync } from "@saberhq/token-utils";
import { useWallet, useConnection, WalletContextState } from "@solana/wallet-adapter-react";
import BN from "bn.js";
import { FluidityInstruction } from "./fluidityInstruction";
import { getFluidInstructionKeys, getOrCreateATA } from "./solanaAddresses";
import { TransactionResponse } from "../instructions";
import {jsonPost} from "~/util/api/rpc";

export const getCheckedSolContext = () => {
  const wallet = useWallet();

  if (!wallet) return new Error("Not wallet found");

  const { connected, publicKey } = wallet;

  if (!connected) return new Error("Not connected");

  if (!publicKey) return new Error("No public key found");

  const { connection } = useConnection();

  return {
    connected,
    publicKey,
    wallet,
    connection,
  };
};

const getBalance = async (connection: Connection, publicKey: PublicKey, token: Token): Promise<BN> => {
  try {
    //balance of SOL represented as a TokenAmount
    if (token.name === "Solana") {
      const value = await connection.getBalance(publicKey);
      return new BN(value);

      //otherwise balance of an SPL token
    } else {
      const ata = getATAAddressSync({
        mint: new PublicKey(token.address),
        owner: publicKey,
      });
      const { value } = await connection.getTokenAccountBalance(ata);
      return new BN(value.amount);
    }
  } catch (e) {
    // if account wasn't found, the user has no ATA and therefore none of the given token
    const trimmedError = (e as Error).message.split(":")?.[2].trim();
    if (trimmedError === "could not find account")
      return new BN(0);

    throw new Error(
      `Could not fetch balance: Could not fetch token ${token.address}: ${e}`
    );
  }
};

type UserMintLimitReq = {
  token_short_name: string;
};

type UserMintLimitRes = {
  mint_limit: number;
};

const limit = async (tokenName: string): Promise<BN> => {
  const url = "https://api.solana.fluidity.money/user-mint-limit";
  const body = {
    token_short_name: tokenName,
  };

  const response = await jsonPost<UserMintLimitReq, UserMintLimitRes>(
    url,
    body
  );

  return new BN(response.mint_limit);
};

type UserAmountMintedReq = {
  address: string;
  token_short_name: string;
};

export type UserAmountMintedRes = {
  amount_minted: number;
};

const amountMinted = async (publicKey: PublicKey, tokenName: string): Promise<BN> => {
  const url = "https://api.solana.fluidity.money/user-amount-minted";
  const body = {
    address: publicKey.toString(),
    token_short_name: tokenName,
  };

  const response = await jsonPost<UserAmountMintedReq, UserAmountMintedRes>(
    url,
    body
  );

  return new BN(response.amount_minted);
};

const internalSwap = async (
  wallet: WalletContextState,
  connection: Connection,
  connected: boolean,
  publicKey: PublicKey,
  amount: string,
  fromToken: Token,
  toToken: Token
): Promise<TransactionResponse | undefined> => {
  if (!wallet.signTransaction)
    throw new Error(`Could not initiate Swap: Wallet cannot sign transactions`);

  const fromFluid = !!fromToken.isFluidOf;

  const [baseToken, fluidToken] = fromFluid
    ? [toToken, fromToken]
    : [fromToken, toToken];

  const obligationAccount = fluidToken.obligationAccount;

  if (!obligationAccount)
    throw new Error(
      `Could not initiate Swap: Fluid token ${fluidToken} missing obligationAccount`
    );

  const dataAccount = fluidToken.dataAccount;

  if (!dataAccount)
    throw new Error(
      `Could not initiate Swap: Fluid token ${fluidToken} missing dataAccount`
    );

  const fromBalance_ = await getBalance(connection, publicKey, fromToken);

  const fromBalance = new BN(fromBalance_);

  const amountBn = new BN(amount);

  if (fromBalance.lt(amountBn)) {
    throw new Error(
      `Could not initiate Swap: Attempted to swap ${amount} ${fromToken.name}, but balance is ${fromBalance}`
    );
  }

  try {
    const baseTokenSymbol = baseToken.symbol;
    const bumpSeed = FluidityInstruction.getBumpSeed(baseTokenSymbol);

    const fluidityInstruction = new FluidityInstruction({
      ...(fromFluid ? { Unwrap: amountBn } : { Wrap: amountBn }),
      TokenSymbol: baseTokenSymbol,
      bumpSeed,
    });

    const ataResult = await getOrCreateATA(
      connection,
      new PublicKey(baseToken.address),
      publicKey,
      publicKey
    );

    const fluidAtaResult = await getOrCreateATA(
      connection,
      new PublicKey(fluidToken.address),
      publicKey,
      publicKey
    );

    //create the transaction
    const transaction = new SolanaTxn({
      feePayer: publicKey,
      // populate with dummy values
      blockhash: "",
      lastValidBlockHeight: 0,
    });

    //add instructions to create missing ATAs
    if (ataResult.instruction) transaction.add(ataResult.instruction);

    if (fluidAtaResult.instruction) transaction.add(fluidAtaResult.instruction);

    const keys = await getFluidInstructionKeys(
      publicKey,
      baseToken,
      fluidToken,
      ataResult.address,
      fluidAtaResult.address,
      new PublicKey(obligationAccount),
      new PublicKey(dataAccount)
    );
    if (!keys) throw new Error("No keys found");

    //create the expected wrap/unwrap instruction
    const instruction = new TransactionInstruction({
      keys,
      programId: new PublicKey("HEvunKKgzf4SMZimVMET6HuzAyfGJS4ZMShUz94KLUdR"),
      data: fluidityInstruction.encode(),
    });

    //fetch blockhash
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();
    if (!connected) await wallet.connect();

    //add blockhash and main swap instruction
    transaction.recentBlockhash = blockhash;
    transaction.lastValidBlockHeight = lastValidBlockHeight;
    transaction.add(instruction);

    // sign
    const signedTxn = await wallet.signTransaction(transaction);
    // send
    const signature = await connection.sendRawTransaction(
      signedTxn.serialize()
    );

    // await confirmation
    return {
      confirmTx: async () =>
        connection
          .confirmTransaction({
            signature,
            blockhash,
            lastValidBlockHeight,
          })
          .then((res) => !!res.value),

      txHash: signature,
    };
  } catch (e: unknown) {
    const sendError = e as SendTransactionError;
    if (sendError.message?.search("0x1") !== -1)
      throw new Error(`Failed to send transaction - balance too low: ${e}`);

    throw e;
  }
};

export { internalSwap, getBalance, limit, amountMinted };
