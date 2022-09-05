package payout

import (
	"fmt"

	"github.com/fluidity-money/fluidity-app/common/solana"
	"github.com/fluidity-money/fluidity-app/common/solana/fluidity"

	"github.com/near/borsh-go"
)

type (
	// InstructionPayout that should be serialised using Borsh to call the
	// contract to payout a winner
	InstructionPayout struct {
		Variant   uint8
		Amount    uint64
		TokenName string
		BumpSeed  uint8
	}

	// PayoutArgs to use for the payout instruction functions -
	// some don't need to be set for CreatePayoutInstruction
	PayoutArgs struct {
		FluidityProgramPubkey    solana.PublicKey
		DataAccountPubkey solana.PublicKey
		MetaSplPubkey     solana.PublicKey
		TokenMintPubkey   solana.PublicKey
		FluidMintPubkey   solana.PublicKey
		PdaPubkey         solana.PublicKey
		ObligationPubkey  solana.PublicKey
		ReservePubkey     solana.PublicKey
		AccountAPubkey    solana.PublicKey
		AccountBPubkey    solana.PublicKey
		PayerPubkey       solana.PublicKey
		WinningAmount     uint64
		TokenName         string
		BumpSeed          uint8
		RecentBlockHash   solana.Hash
	}
)

// CreatePayoutInstruction, ready to be signed and sent out (optionally
// call SendPayoutInstruction) to do it all at once
func CreatePayoutInstruction(args PayoutArgs) (rawTransaction *InstructionPayout, accountMetas solana.AccountMetaSlice, borshSerialised []byte, err error) {
	var (
		// fluidityDataAccount is used to read keys from
		fluidityDataAccount = solana.NewAccountMeta(args.DataAccountPubkey, false, false)

		// underlyingTokenMint is used to ensure the correct fluid account is being used
		underlyingTokenMint = solana.NewAccountMeta(args.TokenMintPubkey, false, false)

		// solanaAccountMetaSpl is used to know where to send transactions
		solanaAccountMetaSpl = solana.NewAccountMeta(args.MetaSplPubkey, false, false)

		// solanaAccountFluidMint is needed to be writable and used as a mint,
		// tracking the amounts of Fluid tokens that the account has. is set to true
		// to indicate mutability
		solanaAccountFluidMint = solana.NewAccountMeta(args.FluidMintPubkey, true, false)

		// solanaAccountPDA is used as an authority to sign off on minting
		// by the payout function
		solanaAccountPDA = solana.NewAccountMeta(args.PdaPubkey, false, false)

		// solanaAccountObligation to use to track the amount of Solend
		// obligations that Fluidity owns to pass the account to do a calculation for
		// the prize pool
		solanaAccountObligation = solana.NewAccountMeta(
			args.ObligationPubkey,
			false,
			false,
		)

		// solanaAccountReserve to use to track the exchange rate of obligation
		// collateral
		solanaAccountReserve = solana.NewAccountMeta(
			args.ReservePubkey,
			false,
			false,
		)

		// accounts used to indicate the payout recipients from the reward function.
		// both accounts are mutable to support sending to the token accounts

		solanaAccountA = solana.NewAccountMeta(args.AccountAPubkey, true, false)
		solanaAccountB = solana.NewAccountMeta(args.AccountBPubkey, true, false)

		// solanaAccountPayer, with true set to sign amounts paid out to the
		// recipients, strictly the fluidity authority
		solanaAccountPayer = solana.NewAccountMeta(
			args.PayerPubkey,
			true,
			true,
		)
	)

	accountMetas = solana.AccountMetaSlice{
		fluidityDataAccount,
		underlyingTokenMint,
		solanaAccountMetaSpl,
		solanaAccountFluidMint,
		solanaAccountPDA,
		solanaAccountObligation,
		solanaAccountReserve,
		solanaAccountA,
		solanaAccountB,
		solanaAccountPayer,
	}

	payoutInstruction := InstructionPayout{
		fluidity.VariantPayout,
		args.WinningAmount,
		args.TokenName,
		args.BumpSeed,
	}

	payoutInstructionBytes, err := borsh.Serialize(payoutInstruction)

	if err != nil {
		return nil, nil, nil, fmt.Errorf(
			"failed to serialise the transaction for making a payout with borsch: %v",
			err,
		)
	}

	return &payoutInstruction, accountMetas, payoutInstructionBytes, nil
}

func CreatePayoutTransaction(args PayoutArgs) (transaction *solana.Transaction, payoutInstruction *InstructionPayout, err error) {
	payoutInstruction, accountMetas, payoutInstructionBytes, err := CreatePayoutInstruction(args)

	if err != nil {
		return nil, nil, err
	}

	instruction := solana.NewInstruction(
		args.FluidityProgramPubkey,
		accountMetas,
		payoutInstructionBytes,
	)

	instructions := []solana.Instruction{instruction}

	transaction, err = solana.NewTransaction(instructions, args.RecentBlockHash)

	if err != nil {
		return nil, nil, fmt.Errorf(
			"failed to create the solana transaction containing the payout: %v",
			err,
		)
	}

	return transaction, payoutInstruction, nil
}
