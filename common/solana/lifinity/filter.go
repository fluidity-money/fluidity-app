package lifinity

import (
	"bytes"
	"encoding/json"
	"fmt"
	"math"
	"math/big"
	"strings"

	"github.com/btcsuite/btcutil/base58"

	solLib "github.com/fluidity-money/fluidity-app/common/solana"
	"github.com/fluidity-money/fluidity-app/common/solana/fluidity"
	"github.com/fluidity-money/fluidity-app/common/solana/pyth"
	"github.com/fluidity-money/fluidity-app/common/solana/rpc"
	"github.com/fluidity-money/fluidity-app/common/solana/spl-token"
	"github.com/fluidity-money/fluidity-app/lib/log"
	types "github.com/fluidity-money/fluidity-app/lib/types/solana"
)

// LifinitySwapInstructionSize is the size of a Lifinity swap instruction enum
const LifinitySwapInstructionSize = 24

// SwapInstruction is the instruction data of a Lifinity swap transaction
type SwapInstruction struct {
	Determinant      [8]byte
	AmountIn         int64
	MinimumAmountOut int64
}

// LifinitySwapInstructionVariant is the enum variant of the Lifinity swap instruction
// this is the first 8 bytes of sha256('global:swap')
var LifinitySwapInstructionVariant = []byte{248, 198, 158, 145, 225, 117, 135, 200}


// FeeData is the fee for a Lifinity swap transaction
type FeeData struct {
	Fee     uint64  `json:"fee"`
	Percent float32	`json:"percent"`
}

func GetLogFees(logs []string, lifinityProgramID string, transactionSignature string) (logFees []uint64, err error) {

	var (
		startString  = fmt.Sprintf("Program %s invoke", lifinityProgramID)
		endString    = fmt.Sprintf("Program %s consumed", lifinityProgramID)
		searchString = "Program log: TotalFee: "
		inSwapLogs   = false
	)


	for i, logString := range logs {

		if !inSwapLogs {
			if strings.HasPrefix(logString, startString) {
				inSwapLogs = true
			}

			continue
		}

		if strings.HasPrefix(logString, endString) {
			inSwapLogs = false

			continue
		}

		if strings.HasPrefix(logString, searchString) {
			var feeData FeeData

			substring := logString[len(searchString):]
			err := json.Unmarshal([]byte(substring), &feeData)

			if err != nil {
				return nil, fmt.Errorf(
					"failed to parse fee from log line %v in %#v! %v",
					i,
					transactionSignature,
					err,
				)
			}

			logFees = append(logFees, feeData.Fee)
		}

	}

	return logFees, nil

}

func GetLifinityFees(solanaClient *rpc.Provider, transaction types.TransactionResult, lifinityProgramID string, fluidTokens map[string]string) (feesPaid *big.Rat, err error) {
	
	var (
		transactionSignature = transaction.Transaction.Signatures[0]
		accountKeys          = transaction.Transaction.Message.AccountKeys
		adjustedPrices         []*big.Rat
	)

	allInstructions := solLib.GetAllInstructions(transaction)

	feesPaid = big.NewRat(0, 1)

	for instructionNumber, instruction := range allInstructions {

		transactionProgramIsLifinity := accountKeys[instruction.ProgramIdIndex] == lifinityProgramID

		if !transactionProgramIsLifinity {
			log.Debugf(
				"instruction %v contained in %v is not a Lifinity instruction",
				instructionNumber,
				transactionSignature,
			)

			continue
		}

		log.Debugf(
			"instruction %v contained in %v is a Lifinity instruction",
			instructionNumber,
			transactionSignature,
		)
		
		instructionByteData := base58.Decode(instruction.Data)	
		
		enoughInstructionBytes := len(instructionByteData) >= LifinitySwapInstructionSize

		if !enoughInstructionBytes {

			log.App(func(k *log.Log) {
				k.Format(
					"instruction %v contained in %#v is not long enough to be a valid Lifinity swap",
					instructionNumber,
					transactionSignature,
				)
			})

			continue
		}

		isLifinitySwap := bytes.Compare(instructionByteData[0:8], LifinitySwapInstructionVariant)

		// bytes.Compare returns 0 if slices are equal
		if isLifinitySwap != 0 {

			log.App(func(k *log.Log) {
				k.Format(
					"instruction %v contained in %#v is not a Lifinity swap",
					instructionNumber,
					transactionSignature,
				)
			})

			continue
		}

		log.Debugf(
			"instruction %v contained in %#v is a valid Lifinity swap",
			instructionNumber,
			transactionSignature,
		)


		var (
			// get user source & destination accounts
			instructionAccounts = instruction.Accounts
			userSourceSplAccount      = accountKeys[instructionAccounts[5]]
			userDestinationSplAccount = accountKeys[instructionAccounts[6]]
		)

		// convert source and destination accounts to public key

		userSourceSplAccountPubkey, err := solLib.PublicKeyFromBase58(userSourceSplAccount)

		if err != nil {
			return nil, fmt.Errorf(
				"failed to get Lifinity source spl-token public key from string %#v in instruction %v in %#v! %v",
				userSourceSplAccount,
				instructionNumber,
				transactionSignature,
				err,
			)
		}

		userDestinationSplAccountPubkey, err := solLib.PublicKeyFromBase58(userDestinationSplAccount)

		if err != nil {
			return nil, fmt.Errorf(
				"failed to get Lifinity destination spl-token public key from string %#v in instruction %v in %#v! %v",
				userDestinationSplAccountPubkey,
				instructionNumber,
				transactionSignature,
				err,
			)
		}

		// get the mint and decimals of the source account

		sourceMint, err := spl_token.GetMintFromPda(
			solanaClient,
			userSourceSplAccountPubkey,
		)

		if err != nil {
			return nil, fmt.Errorf(
				"failed to get Lifinity source spl-token mint %#v in instruction %v in %#v! %v",
				userSourceSplAccountPubkey,
				instructionNumber,
				transactionSignature,
				err,
			)
		}

		decimals, err := spl_token.GetDecimalsFromPda(
			solanaClient,
			userSourceSplAccountPubkey,
			"",
		)

		if err != nil {
			return nil, fmt.Errorf(
				"failed to get decimals for Lifinity source spl-token mint %#v in instruction %v in %#v! %v",
				userSourceSplAccountPubkey,
				instructionNumber,
				transactionSignature,
				err,
			)
		}


		// get the mint of the destination account

		destinationMint, err := spl_token.GetMintFromPda(
			solanaClient,
			userDestinationSplAccountPubkey,
		)

		if err != nil {
			return nil, fmt.Errorf(
				"failed to get Lifinity destination spl-token mint %#v in instruction %v in %#v! %v",
				userDestinationSplAccountPubkey,
				instructionNumber,
				transactionSignature,
				err,
			)
		}

		var (
			// check if the transaction involves a fluid token
			sourceMintIsFluid      = fluidity.IsFluidToken(sourceMint.String(), fluidTokens)
			destinationMintIsFluid = fluidity.IsFluidToken(destinationMint.String(), fluidTokens)
		)

		// if neither token is fluid we don't care about this transaction
		if !sourceMintIsFluid && !destinationMintIsFluid {

			log.App(func(k *log.Log) {
				k.Format(
					"no fluid tokens in Lifinity swap contained in instruction %v in %#v",
					instructionNumber,
					transactionSignature,
				)
			})

			// add an empty entry to adjustedPrices to maintain correspondence
			emptyRat := big.NewRat(0, 1)
			adjustedPrices = append(adjustedPrices, emptyRat)

			continue
		}

		// if the source mint is a fluid token, use its non-fluid counterpart

		if sourceMintIsFluid {
			newMint, err := fluidity.GetBaseToken(sourceMint.String(), fluidTokens)

			if err != nil {
				return nil, fmt.Errorf(
					"failed to convert fluid token to base token in instruction %v in %#v! %v",
					instructionNumber,
					transactionSignature,
					err,
				)
			}

			sourceMint, err = solLib.PublicKeyFromBase58(newMint)

			if err != nil {
				return nil, fmt.Errorf(
					"failed to get the mint public key from base58 %#v instruction %v in %#v: %v",
					newMint,
					instructionNumber,
					transactionSignature,
					err,
				)
			}
		}

		price, err := pyth.GetPriceByToken(solanaClient, sourceMint.String())

		if err != nil {
			return nil, fmt.Errorf(
				"failed to get price of source token in instruction %v in %#v! %v",
				instructionNumber,
				transactionSignature,
				err,
			)
		}

		log.Debugf(
			"got price of the source token (%v) in instruction %v in %#v: %v",
			sourceMint.String(),
			instructionNumber,
			transactionSignature,
			price,
		)
		
		// Adjust token price by decimals
		decimalScalingFactor := math.Pow10(int(decimals))
		decimalRat := new(big.Rat).SetFloat64(decimalScalingFactor)

		adjustedPrice := price.Quo(price, decimalRat)
		adjustedPrices = append(adjustedPrices, adjustedPrice)
	}

	logFees, err := GetLogFees(transaction.Meta.Logs, lifinityProgramID, transactionSignature)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to get fees from logs in %#v! %v",
			transactionSignature,
			err,
		)
	}

	// adjustedPrices and logFeeDatas should have exact correspondence
	// lack of correspondence likely indicates error in log processing

	if len(adjustedPrices) != len(logFees) {
		return nil, fmt.Errorf(
			"failed to parse fee from log line %v in %#v! %v",
			"lifinity swap token price count (%v) and logged fee count (%v) did not match!",
			len(adjustedPrices),
			len(logFees),
		)
	}

	for i, price := range adjustedPrices {

		fee := logFees[i]
		feeAmount := big.NewRat(int64(fee), 1)

		// normalise to USD
		feeAmount = feeAmount.Mul(feeAmount, price)

		feesPaid.Add(feesPaid, feeAmount)
	}	

	return feesPaid, nil
}
