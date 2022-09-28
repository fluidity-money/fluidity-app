package mercurial

import (
	"bytes"
	"fmt"
	"math/big"

	"github.com/fluidity-money/fluidity-app/common/solana"
	"github.com/fluidity-money/fluidity-app/common/solana/rpc"
	"github.com/fluidity-money/fluidity-app/common/solana/spl-token"
	"github.com/fluidity-money/fluidity-app/lib/log"
	types "github.com/fluidity-money/fluidity-app/lib/types/solana"

	"github.com/near/borsh-go"

	"github.com/btcsuite/btcutil/base58"
)

const SplTransferDiscriminant = 3

func GetMercurialFees(solanaClient *rpc.Provider, transaction types.TransactionResult, mercurialProgramId string, fluidTokens map[string]string) (feesPaid *big.Rat, err error){

	var (
		transactionSignature = transaction.Transaction.Signatures[0]
		accountKeys          = transaction.Transaction.Message.AccountKeys
	)

	allInstructions := solana.GetAllInstructions(transaction)

	// MercurialSwapInstructionVariant is the enum variant of the Mercurial swap instruction
	// this is the first 8 bytes of sha256('global:swap')
	var MercurialSwapInstructionVariant = []byte{248, 198, 158, 145, 225, 117, 135, 200}

	// rat to store the total fee
	feesPaid = big.NewRat(0, 1)

	for instructionNumber, instruction := range allInstructions {

		transactionProgramIsMercurial := accountKeys[instruction.ProgramIdIndex] == mercurialProgramId

		if !transactionProgramIsMercurial {

			log.App(func(k *log.Log) {
				k.Format(
					"instruction %v contained in %v is not a Mercurial instruction",
					instructionNumber,
					transactionSignature,
				)
			})

			continue
		}

		log.Debugf(
			"instruction %v contained in %v is a Mercurial instruction",
			instructionNumber,
			transactionSignature,
		)

		instructionByteData := base58.Decode(instruction.Data)

		isMercurialSwap := bytes.Compare(instructionByteData[0:8], MercurialSwapInstructionVariant)

		// bytes.Compare returns 0 if slices are equal
		if isMercurialSwap != 0 {

			log.App(func(k *log.Log) {
				k.Format(
					"instruction %v contained in %#v is not a Mercurial swap",
					instructionNumber,
					transactionSignature,
				)
			})

			continue
		}

		log.Debugf(
			"instruction %v contained in %#v is a valid Mercurial swap",
			instructionNumber,
			transactionSignature,
		)

		numberOfBaseInstructions := len(transaction.Transaction.Message.Instructions)

		innerInstructions := transaction.Meta.InnerInstructions

		var feeTransferInstruction types.TransactionInstruction

		transferNumber := 0

		for instructionNumber + transferNumber + 1 < len(allInstructions) {

			if instructionNumber < numberOfBaseInstructions {

				// find the first inner instruction
				var innerInstruction types.TransactionInnerInstruction

				for _, inner := range(innerInstructions) {
					if inner.Index == instructionNumber {
						innerInstruction = inner
					}
				}

				if len(innerInstruction.Instructions) == 0 {
					return nil, fmt.Errorf(
						"could not find Aldrin swap inner instructions!",
					)
				}

				if transferNumber > len(innerInstruction.Instructions) {
					return nil, fmt.Errorf(
						"inner transaction number %v does not exist!",
						transferNumber,
					)
				}

				feeTransferInstruction = innerInstruction.Instructions[transferNumber]

			} else {

				// use the next instruction
				feeTransferInstruction = allInstructions[instructionNumber+1+transferNumber]

			}

			feeTransferInstructionData := base58.Decode(feeTransferInstruction.Data)

			transferProgram, err := solana.PublicKeyFromBase58(accountKeys[feeTransferInstruction.ProgramIdIndex])

			if err != nil {
				return nil, fmt.Errorf(
					"failed to get public key of tranfer instruction program ID! %v",
					err,
				)
			}

			if transferProgram != spl_token.TokenProgramAddressPubkey {
				break
			}

			if feeTransferInstructionData[0] != SplTransferDiscriminant {
				break
			}

			var feeAmount int64

			err = borsh.Deserialize(&feeAmount, feeTransferInstructionData[1:])

			if err != nil {
				return nil, fmt.Errorf(
					"failed to deserialise Mercurial destination transfer instruction data! %v",
					err,
				)
			}

			log.Debugf("fee amount from transfer %v", feeAmount)

			// public key of the mercurial fee token account
			feeTokenAccountPubkeyString := accountKeys[feeTransferInstruction.Accounts[1]]

			feeTokenAccountPubkey, err := solana.PublicKeyFromBase58(
				feeTokenAccountPubkeyString,
			)

			if err != nil {
				return nil, fmt.Errorf(
					"failed to get Mercurial destination (fee) spl-token public key from string %#v: %v",
					feeTokenAccountPubkeyString,
					err,
				)
			}

			destinationDecimals, err := spl_token.GetDecimalsFromPda(
				solanaClient,
				feeTokenAccountPubkey,
				"",
			)

			if err != nil {
				return nil, fmt.Errorf(
					"failed to get Aldrin destination (fee) spl-token decimals %#v! %v",
					feeTokenAccountPubkey,
					err,
				)
			}

			destinationTransferAmountAdjusted := spl_token.AdjustDecimals(
				feeAmount,
				int(destinationDecimals),
			)

			feesPaid.Add(feesPaid, destinationTransferAmountAdjusted)

			// check next fee transfer
			transferNumber += 1
		}
	}

	log.Debugf("Paid %v in fees!", feesPaid)

	return feesPaid, nil
}
