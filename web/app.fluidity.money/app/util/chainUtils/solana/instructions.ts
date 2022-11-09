import {
  Transaction as SolanaTxn,
  TransactionInstruction,
  PublicKey,
  SendTransactionError,
} from "@solana/web3.js";
import { getATAAddressSync, getOrCreateATA } from "@saberhq/token-utils";
import { useSolana } from "@saberhq/use-solana";
import { jsonPost, getTokenFromAddress } from "~/util";
import { BN } from "bn.js";
import { FluidityInstruction } from "./fluidityInstruction";
import { getFluidInstructionKeys } from "./solanaAddresses";

type MintLimitReq = {
  address: string;
};

type MintLimitRes = number;

const getCheckedSolContext = () => {
  const sol = useSolana();

  if (!sol.connected) return new Error("Not connected");

  if (!sol.wallet) return new Error("No wallet found");

  if (!sol.publicKey) return new Error("No public key found");

  if (!sol.providerMut) return new Error("No provider found");

  return {
    connected: sol.connected,
    publicKey: sol.publicKey,
    wallet: sol.wallet,
    providerMut: sol.providerMut,
    connection: sol.connection,
  };
};

const balance = async (tokenAddr: string): Promise<string> => {
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
      return value.toString();

      //otherwise balance of an SPL token
    } else {
      const ata = getATAAddressSync({
        mint: new PublicKey(token.address),
        owner: publicKey,
      });
      const { value } = await connection.getTokenAccountBalance(ata);
      return value.amount;
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

const swap = async (
  amount: string,
  fluidTokenAddr: string,
  swapForFluid: boolean
) => {
  const solContext = getCheckedSolContext();

  if (solContext instanceof Error) {
    throw new Error(`Could not fetch balance: ${solContext}`);
  }

  const { publicKey, wallet, providerMut, connection } = solContext;

  const fluidToken = getTokenFromAddress("solana", fluidTokenAddr);

  if (!fluidToken)
    throw new Error(
      `Could not initiate Swap: Could not find matching token ${fluidToken} in solana`
    );

  const baseTokenAddr = fluidToken.isFluidOf;
  if (!baseTokenAddr)
    throw new Error(
      `Could not initiate Swap: Could not find fluid pair token from ${fluidToken} in solana`
    );

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

  const baseToken = getTokenFromAddress("solana", baseTokenAddr);
  if (!baseToken)
    throw new Error(
      `Could not initiate Swap: Could not find matching base token ${baseTokenAddr} in solana`
    );

  const srcToken = swapForFluid ? baseToken : fluidToken;

  const srcBalance_ = await balance(srcToken.address);

  const srcBalance = new BN(srcBalance_);

  const amountBn = new BN(amount);

  if (srcBalance.lt(amountBn)) {
    throw new Error(
      `Could not initiate Swap: Attempted to swap ${amount} ${srcToken.name}, but balance is ${srcBalance}`
    );
  }

  try {
    const baseTokenSymbol = baseToken.symbol;
    const bumpSeed = await FluidityInstruction.getBumpSeed(baseTokenSymbol);

    const fluidityInstruction = new FluidityInstruction({
      ...(swapForFluid ? { Wrap: amountBn } : { Unwrap: amountBn }),
      TokenSymbol: baseTokenSymbol,
      bumpSeed,
    });

    const ataResult = await getOrCreateATA({
      provider: providerMut,
      mint: new PublicKey(baseToken.address),
    });
    const fluidAtaResult = await getOrCreateATA({
      provider: providerMut,
      mint: new PublicKey(fluidToken.address),
    });

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
    if (!wallet.connected) await wallet.connect();

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

export const solanaInstructions = () => {
  return {
    balance: balance,
    swap: swap,
    limit: limit,
  };
};
