import type { Token } from "~/util/chainUtils/tokens";

import {
  Transaction as SolanaTxn,
  TransactionInstruction,
  PublicKey,
  SendTransactionError,
} from "@solana/web3.js";
import { getATAAddressSync } from "@saberhq/token-utils";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { jsonPost, getTokenFromAddress, getTokenForNetwork } from "~/util";
import { BN } from "bn.js";
import { FluidityInstruction } from "./fluidityInstruction";
import { getFluidInstructionKeys, getOrCreateATA } from "./solanaAddresses";

type MintLimitReq = {
  address: string;
};

type MintLimitRes = number;

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

const balance = async (tokenAddr: string): Promise<number> => {
  const solContext = getCheckedSolContext();

  if (solContext instanceof Error) {
    throw new Error(`Could not fetch balance: ${solContext}`);
  }

  const { publicKey, connection } = solContext;

  if (!publicKey)
    throw new Error(`Could not fetch balance: No public key found`);

  const token = getTokenFromAddress("solana", tokenAddr);
  if (!token)
    throw new Error(
      `Could not fetch balance: Could not find matching token ${tokenAddr} in solana`
    );

  try {
    //balance of SOL represented as a TokenAmount
    if (token.name === "Solana") {
      const value = await connection.getBalance(publicKey);
      return value;

      //otherwise balance of an SPL token
    } else {
      const ata = getATAAddressSync({
        mint: new PublicKey(token.address),
        owner: publicKey,
      });
      const { value } = await connection.getTokenAccountBalance(ata);
      return parseInt(value.toString());
    }
  } catch (e) {
    throw new Error(
      `Could not fetch balance: Could not fetch token ${token.address}`
    );
  }
};

const limit = async (): Promise<number> => {
  const solContext = getCheckedSolContext();

  if (solContext instanceof Error) {
    throw new Error(`Could not fetch balance: ${solContext}`);
  }

  const { publicKey } = solContext;

  const url = "https://backend.solana.fluidity.money";
  const body = {
    address: publicKey.toString(),
  };

  const response = await jsonPost<MintLimitReq, MintLimitRes>(url, body);

  return response;
};

const swap = async (amount: string, fromTokenAddr: string) => {
  const solContext = getCheckedSolContext();

  if (solContext instanceof Error) {
    throw new Error(`Could not fetch balance: ${solContext}`);
  }

  const { publicKey, wallet, connection, connected } = solContext;

  if (!wallet.signTransaction)
    throw new Error(`Could not initiate Swap: Wallet cannot sign transactions`);

  const fromToken = getTokenFromAddress("solana", fromTokenAddr);

  if (!fromToken)
    throw new Error(
      `Could not initiate Swap: Could not find matching token ${fromTokenAddr} in solana`
    );

  // true if swapping from fluid -> non-fluid
  const fromFluid = !!fromToken.isFluidOf;

  const fluidAssets = getTokenForNetwork("solana");

  if (!fluidAssets.length)
    throw new Error(
      `Could not initiate Swap: Could not get fluid tokens from solana`
    );

  const toToken = fromToken.isFluidOf
    ? getTokenFromAddress("solana", fromToken.isFluidOf)
    : fluidAssets.reduce((_: Token | null, fluidTokenAddr: string) => {
        const fluidToken = getTokenFromAddress("solana", fluidTokenAddr);

        if (!fluidToken)
          throw new Error(
            `Could not find Fluid token ${fluidTokenAddr} in solana`
          );

        return fluidToken.isFluidOf === fromTokenAddr ? fluidToken : null;
      }, null);

  if (!toToken)
    throw new Error(
      `Could not initiate Swap: Could not find dest pair token from ${fromTokenAddr} in solana`
    );

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

  const fromBalance_ = await balance(fromToken.address);

  const fromBalance = new BN(fromBalance_);

  const amountBn = new BN(amount);

  if (fromBalance.lt(amountBn)) {
    throw new Error(
      `Could not initiate Swap: Attempted to swap ${amount} ${fromToken.name}, but balance is ${fromBalance}`
    );
  }

  try {
    const baseTokenSymbol = baseToken.symbol;
    const bumpSeed = await FluidityInstruction.getBumpSeed(baseTokenSymbol);

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
    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight,
    });
  } catch (e: unknown) {
    const sendError = e as SendTransactionError;
    if (sendError.message?.search("0x1") !== -1)
      throw new Error(`Failed to send transaction - balance too low: ${e}`);

    throw e;
  }
};

export const solanaInstructions = {
  balance: balance,
  swap: swap,
  limit: limit,
};
