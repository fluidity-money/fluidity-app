// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE.md file.

import {UseSolana} from "@saberhq/use-solana";
import {Transaction as SolanaTxn, TransactionInstruction, PublicKey, SendTransactionError} from '@solana/web3.js';
import {BigintIsh, getATAAddressSync, getOrCreateATA} from '@saberhq/token-utils';
import * as splToken from '@solana/spl-token';
import {TOKEN_PROGRAM_ID} from '@solana/spl-token';
import {FluidityInstruction} from "./FluidityInstruction";
import {TokenAmount} from "@saberhq/token-utils";
import {ReadonlyProvider} from "@saberhq/solana-contrib";
import {getFluidInstructionKeys} from "./transactionUtils";
import {Network} from "../../components/chains/ChainContext";
import {FluidSolanaToken, UnwrappedSolanaToken} from "./token";

//internal method
const wrapOrUnwrapSpl = async (
  sol: UseSolana<any>,
  fluidProgramId: PublicKey,
  token: UnwrappedSolanaToken,
  fluidToken: FluidSolanaToken,
  fluidityInstruction: FluidityInstruction,
  network: Network<"solana">
): Promise<string> => {

  if (!sol.wallet || !sol.publicKey || !sol.connected || !sol.providerMut)
    return "";

  const {address: tokenMint} = token;
  const {address: fluidTokenMint} = fluidToken;
  
  const ataResult = await getOrCreateATA({provider: sol.providerMut, mint: new PublicKey(tokenMint)});
  const fluidAtaResult = await getOrCreateATA({provider: sol.providerMut, mint: new PublicKey(fluidTokenMint)});
  
  //create the transaction
  const transaction = new SolanaTxn({
    feePayer: sol.publicKey,
    // populate with dummy values
    blockhash: "",
    lastValidBlockHeight: 0,
  })

  //add instructions to create missing ATAs
  if (ataResult.instruction)
    transaction.add(ataResult.instruction);

  if (fluidAtaResult.instruction)
    transaction.add(fluidAtaResult.instruction);

  const keys = await getFluidInstructionKeys(
    sol,
    fluidProgramId,
    token,
    fluidToken,
    ataResult.address,
    fluidAtaResult.address,
    network,
  );
  if (!keys)
    return "";
  
  //create the expected wrap/unwrap instruction
  const instruction = new TransactionInstruction({
    keys,
    programId: new PublicKey(fluidProgramId),
    data: fluidityInstruction.encode(),
  });

  //fetch blockhash
  const {blockhash, lastValidBlockHeight} = await sol.connection.getLatestBlockhash();
  if (!sol.wallet.connected)
    await sol.wallet.connect();

  //add blockhash and main swap instruction
  transaction.recentBlockhash = blockhash;
  transaction.lastValidBlockHeight = lastValidBlockHeight;
  transaction.add(instruction);

  // sign
  const signedTxn = await sol.wallet.signTransaction(transaction);
  // send
  const signature = await sol.sendConnection.sendRawTransaction(signedTxn.serialize())
  // await confirmation
  await sol.sendConnection.confirmTransaction({
    signature,
    blockhash,
    lastValidBlockHeight,
  })
  // return hash
  return signature;
}


//wrapper's wrapper functions
export const wrapSpl = async(
  sol: UseSolana<any>,
  fluidProgramId: PublicKey,
  token: UnwrappedSolanaToken,
  fluidToken: FluidSolanaToken,
  amount: BigintIsh,
  network: Network<"solana">
) => {
  const wrapAmount = token.tokenAmount(amount);
  const TokenSymbol = token.symbol;
  const bumpSeed = await FluidityInstruction.getBumpSeed(TokenSymbol, fluidProgramId);

  return await wrapOrUnwrapSpl(
    sol,
    fluidProgramId,
    token,
    fluidToken,
    new FluidityInstruction({
      Wrap: wrapAmount,
      TokenSymbol,
      bumpSeed,
    }),
    network,
  );
}

export const unwrapSpl = async(
  sol: UseSolana<any>,
  fluidProgramId: PublicKey,
  token: UnwrappedSolanaToken,
  fluidToken: FluidSolanaToken,
  amount: BigintIsh,
  network: Network<"solana">
) => {
  const unwrapAmount = token.tokenAmount(amount);
  const TokenSymbol = token.symbol;
  const bumpSeed = await FluidityInstruction.getBumpSeed(TokenSymbol, fluidProgramId);

  return await wrapOrUnwrapSpl(
    sol,
    fluidProgramId,
    token,
    fluidToken,
    new FluidityInstruction({
      Unwrap: unwrapAmount,
      TokenSymbol,
      bumpSeed,
    }),
    network,
  );
}

//given a recipient that may be a user account or an ATA, return the correct ATA or null if invalid
export const getRecipientATA = async(recipient: PublicKey, mint: PublicKey, provider: ReadonlyProvider): Promise<PublicKey | null> => {
  //`recipient` is user account | ATA for that account | invalid
  //if owned by system program -> user account -> fetch ATA
  //if owned by token account -> is ATA
  let recipientATA: PublicKey;
  const {accountInfo: {owner = null} = {}} = await provider.getAccountInfo(recipient) || {};

  //account isn't initalised, so fail
  if (!owner)
    return null;

  if (owner.equals(TOKEN_PROGRAM_ID))
    recipientATA = recipient;
  else {
    const maybeATA = getATAAddressSync({mint, owner: recipient});
    //getInfo to check if it exists
    const maybeATAInfo = await provider.getAccountInfo(maybeATA)

    if (maybeATAInfo) recipientATA = maybeATA;
    else return null;
  }
  return recipientATA;
}

//send a token, returning either the successful transaction hash, or null for failure, 
//e.g. if the ATA doesn't exist or is invalid
export const sendSol = async (sol: UseSolana<any>, recipient: PublicKey, amount: TokenAmount): Promise<string | null> => {
  if (!sol.wallet || !sol.publicKey || !sol.connected || !sol.providerMut)
    throw({message: "Not connected to wallet!"})

  const {token} = amount;
  const {publicKey} = sol;

  let ataResult = await getOrCreateATA({provider: sol.providerMut, mint: token.mintAccount, owner: sol.publicKey, payer: sol.publicKey})

  //create the txn
  const transaction = new SolanaTxn({
    feePayer: publicKey,
    // use dummy values and update later
    blockhash: "",
    lastValidBlockHeight: 0,
  });

  // add instruction to create ata if not exists
  if (ataResult.instruction)
    transaction.add(ataResult.instruction)

  const ata = ataResult.address;

  // find the actual ATA, given the input is either a normal account or the correct ATA 
  // (ATAs for other mints will fail later)
  let recipientAddress: PublicKey;
  const maybeRecipient = await getRecipientATA(recipient, token.mintAccount, sol.provider);

  if (maybeRecipient) {
    // account exists, so use it 
    recipientAddress = maybeRecipient;
  } else {
    // account doesn't exist, so get the create instruction
    const recipientATA = await getOrCreateATA({
      provider: sol.providerMut,
      owner: recipient,
      mint: token.mintAccount,
      payer: sol.publicKey,
    });

    if (recipientATA.instruction)
      transaction.add(recipientATA.instruction);

    recipientAddress = recipientATA.address;
  }
  //get blockhash
  const {blockhash, lastValidBlockHeight} = await sol.connection.getLatestBlockhash();
  if (!sol.wallet.connected)
    await sol.wallet.connect();

  transaction.recentBlockhash = blockhash;
  transaction.lastValidBlockHeight = lastValidBlockHeight;
    
  // add the send instruction
  transaction.add(
     splToken.Token.createTransferInstruction(
       splToken.TOKEN_PROGRAM_ID, //program id for SPL token to execute the instruction
       ata, //the user's token account for this token
       recipientAddress, //recipient ATA
       sol.publicKey, //the user's main acc public key
       [], //multisig signers
       amount.toU64() //amount in token units
     )
  )

  try {
    // sign
    const signedTxn = await sol.wallet.signTransaction(transaction);
    // send
    const signature = await sol.sendConnection.sendRawTransaction(signedTxn.serialize())
    // await confirmation
    await sol.sendConnection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight,
    })
    // return hash
    return signature;
  } catch (e: unknown) {
    const sendError = e as SendTransactionError;
    if (sendError.message?.search('0x1') !== -1)
      console.error("Failed to send transaction - balance too low")

    throw e;
  }
}

