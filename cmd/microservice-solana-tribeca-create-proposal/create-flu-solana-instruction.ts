import { web3 } from "@project-serum/anchor";
import { PublicKey } from "@saberhq/solana-contrib";
import { serialize } from "borsh";
import BN from "bn.js";
import { base58_to_binary } from "base58-js";

const SECRET_KEY = process.env.FLU_SOLANA_PAYER as string;

if (!SECRET_KEY) {
  throw new Error("SECRET_KEY not provided");
}

const FLU_SOLANA_PROGRAM_ID = process.env.FLU_SOLANA_PROGRAM_ID as string;

if (!FLU_SOLANA_PROGRAM_ID) {
  throw new Error("PROGRAM_ID not provided");
}

const FLU_SOLANA_RPC_URL = process.env.FLU_SOLANA_RPC_URL as string;

if (!FLU_SOLANA_RPC_URL) {
  throw new Error("SOLANA_RPC not provided");
}

const SPL_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

const FLU_SOLANA_FLUID_MINT_PUBKEY = process.env
  .FLU_SOLANA_FLUID_MINT_PUBKEY as string;

if (!FLU_SOLANA_FLUID_MINT_PUBKEY) {
  throw new Error("FLU_SOLANA_FLUID_MINT_PUBKEY not provided");
}

const FLU_SOLANA_TOKEN_NAME = process.env.FLU_SOLANA_TOKEN_NAME as string;

if (!FLU_SOLANA_TOKEN_NAME) {
  throw new Error("FLU_SOLANA_TOKEN_NAME not provided");
}

const FLU_SOLANA_OBLIGATION_PUBKEY = process.env
  .FLU_SOLANA_OBLIGATION_PUBKEY as string;

if (!FLU_SOLANA_OBLIGATION_PUBKEY) {
  throw new Error("FLU_SOLANA_OBLIGATION_PUBKEY not provided");
}

const FLU_SOLANA_RESERVE_PUBKEY = process.env
  .FLU_SOLANA_RESERVE_PUBKEY as string;

if (!FLU_SOLANA_RPC_URL) {
  throw new Error("FLU_SOLANA_RESERVE_PUBKEY not provided");
}

const FLU_SOLANA_RECEIVER_PUBKEY = process.env
  .FLU_SOLANA_RECEIVER_PUBKEY as string;

if (!FLU_SOLANA_RPC_URL) {
  throw new Error("FLU_SOLANA_RECEIVER_PUBKEY not provided");
}

const FLU_SOLANA_PAYOUT_AMOUNT_ = process.env
  .FLU_SOLANA_PAYOUT_AMOUNT as string;

if (!FLU_SOLANA_PAYOUT_AMOUNT_) {
  throw new Error("FLU_SOLANA_PAYOUT_AMOUNT not provided");
}

const FLU_SOLANA_PAYOUT_AMOUNT = new BN(FLU_SOLANA_PAYOUT_AMOUNT_);

if (!FLU_SOLANA_PAYOUT_AMOUNT) {
  throw new Error("Invalid FLU_SOLANA_PAYOUT_AMOUNT");
}

// initialize keys
const payerKeypair = web3.Keypair.fromSecretKey(base58_to_binary(SECRET_KEY));

module.exports.drainInstructionHandler = async () => {
  const [solanaAccountPda, solanaAccountPdaBump] = await PublicKey
    .findProgramAddress(
      [Buffer.from(`FLU:${FLU_SOLANA_TOKEN_NAME}_OBLIGATION`)],
      new PublicKey(FLU_SOLANA_PROGRAM_ID),
    );

  const accounts: web3.AccountMeta[] = [
    // solanaAccountMetaSpl is used to know where to send transactions
    {
      pubkey: new PublicKey(SPL_PROGRAM_ID),
      isWritable: false,
      isSigner: false,
    },
    // solanaAccountFluidMint is needed to be writable and used as a mint,
    // tracking the amounts of Fluid tokens that the account has. is set to true
    // to indicate mutability
    {
      pubkey: new PublicKey(FLU_SOLANA_FLUID_MINT_PUBKEY),
      isWritable: true,
      isSigner: false,
    },
    // solanaAccountPDA is used as an authority to sign off on minting
    // by the payout function
    {
      pubkey: solanaAccountPda,
      isWritable: false,
      isSigner: false,
    },
    // solanaAccountObligation to use to track the amount of Solend
    // obligations that Fluidity owns to pass the account to do a calculation for
    // the prize pool
    {
      pubkey: new PublicKey(FLU_SOLANA_OBLIGATION_PUBKEY),
      isWritable: false,
      isSigner: false,
    },
    // solanaAccountReserve to use to track the exchange rate of obligation
    // collateral// solanaAccountMetaSpl
    {
      pubkey: new PublicKey(FLU_SOLANA_RESERVE_PUBKEY),
      isWritable: false,
      isSigner: false,
    },
    // solanaReceiver account used to indicate the payout recipients from the reward function.
    // receiver account is mutable to support sending to the token accounts
    {
      pubkey: new PublicKey(FLU_SOLANA_RECEIVER_PUBKEY),
      isWritable: true,
      isSigner: false,
    },
    // solanaAccountPayer, with true set to sign amounts paid out to the
    // recipients, strictly the fluidity authority
    {
      pubkey: payerKeypair.publicKey,
      isWritable: true,
      isSigner: true,
    },
  ];

  class DrainInstruction {
    variant: number;
    payoutAmount: BN;
    tokenName: string;
    bump: number;

    constructor(
      { variant, payoutAmount, tokenName, bump }: {
        variant: number;
        payoutAmount: BN;
        tokenName: string;
        bump: number;
      },
    ) {
      this.variant = variant;
      this.payoutAmount = payoutAmount;
      this.tokenName = tokenName;
      this.bump = bump;
    }
  }

  const drainInstruction = new DrainInstruction({
    variant: 6,
    payoutAmount: FLU_SOLANA_PAYOUT_AMOUNT,
    tokenName: FLU_SOLANA_TOKEN_NAME,
    bump: solanaAccountPdaBump,
  });

  const drainInstructionSchema = new Map([[DrainInstruction, {
    kind: "struct",
    fields: [
      ["variant", "u8"],
      ["payout_amt", "u64"],
      ["tokenName", "string"],
      ["bump", "u8"],
    ],
  }]]);

  const drainInstructionData = serialize(
    drainInstructionSchema,
    drainInstruction,
  );

  const instruction = new web3.TransactionInstruction({
    programId: new PublicKey(FLU_SOLANA_PROGRAM_ID),
    keys: accounts,
    data: Buffer.from(drainInstructionData),
  });

  return { instruction, signers: [payerKeypair] };
};
