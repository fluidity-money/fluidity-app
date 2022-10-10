// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import {UseSolana} from "@saberhq/use-solana";
import {Transaction as SolanaTxn, TransactionInstruction, PublicKey, SendTransactionError} from '@solana/web3.js';
import {getATAAddressSync, getOrCreateATA, Token} from '@saberhq/token-utils';
import * as splToken from '@solana/spl-token';
import {TOKEN_PROGRAM_ID} from '@solana/spl-token';
import {FluidityInstruction} from "util/solana/FluidityInstruction";
import {FLUID_PROGRAM_ID} from "./constants";
import {TokenAmount} from "@saberhq/token-utils";
import {ReadonlyProvider} from "@saberhq/solana-contrib";
import {SupportedTokens} from "components/types";
import {getFluidInstructionKeys} from "./transactionUtils";

//internal method
const wrapOrUnwrapSpl = async (
  sol: UseSolana<any>,
  token: Token,
  fluidToken: Token,
  fluidityInstruction: FluidityInstruction,
  obligationAccount: PublicKey,
  dataAccount: PublicKey, 
): Promise<string> => {

  if (!sol.wallet || !sol.publicKey || !sol.connected || !sol.providerMut)
    return "";
  
  const ataResult = await getOrCreateATA({provider: sol.providerMut, mint: token.mintAccount});
  const fluidAtaResult = await getOrCreateATA({provider: sol.providerMut, mint: fluidToken.mintAccount});
  
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
    token,
    fluidToken,
    ataResult.address,
    fluidAtaResult.address,
    obligationAccount,
    dataAccount,
  );
  if (!keys)
    return "";
  
  //create the expected wrap/unwrap instruction
  const instruction = new TransactionInstruction({
    keys,
    programId: new PublicKey(FLUID_PROGRAM_ID),
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
  fluidToken: Token,
  amount: TokenAmount,
  obligationAccount: PublicKey,
  dataAccount: PublicKey,
) => {
  const TokenSymbol = amount.token.symbol as SupportedTokens;
  const bumpSeed = await FluidityInstruction.getBumpSeed(TokenSymbol);

  return await wrapOrUnwrapSpl(
    sol,
    amount.token,
    fluidToken,
    new FluidityInstruction({
      Wrap: amount,
      TokenSymbol,
      bumpSeed,
    }),
    obligationAccount,
    dataAccount,
  );
}

export const unwrapSpl = async(
  sol: UseSolana<any>,
  fluidToken: Token,
  amount: TokenAmount,
  obligationAccount: PublicKey,
  dataAccount: PublicKey,
) => {
  const TokenSymbol = amount.token.symbol as SupportedTokens;
  const bumpSeed = await FluidityInstruction.getBumpSeed(TokenSymbol);

  return await wrapOrUnwrapSpl(
    sol,
    amount.token,
    fluidToken,
    new FluidityInstruction({
      Unwrap: amount,
      TokenSymbol,
      bumpSeed,
    }),
    obligationAccount,
    dataAccount,
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
export const sendSol = async (sol: UseSolana<any>, recipient: PublicKey, amount: TokenAmount, addError: (e: string) => void): Promise<string | null> => {
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
      addError("Failed to send transaction - balance too low")

    throw e;
  }
}

