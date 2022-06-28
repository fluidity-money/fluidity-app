package orca

import (
	"context"
	"fmt"
	"math"
	"math/big"

	"github.com/fluidity-money/fluidity-app/common/solana/fluidity"
	"github.com/fluidity-money/fluidity-app/common/solana/pyth"
	types "github.com/fluidity-money/fluidity-app/lib/types/solana"

	"github.com/btcsuite/btcutil/base58"
	"github.com/gagliardetto/solana-go"
	solanaRpc "github.com/gagliardetto/solana-go/rpc"
	"github.com/near/borsh-go"
)

// Byte offset at which the curve data is stored
const CurveDataStartByte = 227

// Byte offset at which the decimals of an spl-mint ins encoded
const SplMintDecimalsStartByte = 44

// Enum variant of swap instruction
const SwapVariant = 1

type (
	// Orca fee data struct that encodes the % fee taken on this pool
	ConstantProductCurveFeeData struct {
		TradeFeeNumerator        int64
		TradeFeeDenominator      int64
		OwnerTradeFeeNumerator   int64
		OwnerTradeFeeDenominator int64
	}

	// Truncated spl-token account struct, used to get the
	// mint of a token account
	SplAccountTruncated struct {
		Mint solana.PublicKey
	}

	// Truncated sql-token mint struct, used to get the
	// decimals of an spl-token mint
	SplMintTruncated struct {
		MintAuthority *solana.PublicKey
		Supply        int64
		Decimals      uint8
	}
)

// GetOrcaFee by checking that an orca swap occurred, then
// destructuring the swap information to get the fee %, and
// getting the fee paid by multiplying the value of the swap
func GetOrcaFee(solanaClient *solanaRpc.Client, transaction types.TransactionResult, orcaProgramId string) (feePaid *big.Rat, err error) {
	instructions := transaction.Transaction.Message.Instructions

	for _, instruction := range instructions {
		if transaction.Transaction.Message.AccountKeys[instruction.ProgramIdIndex] == orcaProgramId {
			// make sure it's a swap instruction
			inputBytes := base58.Decode(instruction.Data)
			if inputBytes[0] != SwapVariant {
				continue
			}

			swapAccount := transaction.Transaction.Message.AccountKeys[instruction.Accounts[0]]
			swapAccountPubkey := solana.MustPublicKeyFromBase58(swapAccount)

			resp, err := solanaClient.GetAccountInfo(context.Background(), swapAccountPubkey)

			if err != nil {
				return nil, fmt.Errorf(
					"failed to get Orca swap data account! %v",
					err,
				)
			}

			var feeData ConstantProductCurveFeeData

			data := resp.Value.Data.GetBinary()

			if len(data) < CurveDataStartByte+32 {
				continue
			}

			err = borsh.Deserialize(&feeData, data[CurveDataStartByte:])
			if err != nil {
				return nil, fmt.Errorf(
					"issue deserialising Orca fee data! %v",
					err,
				)
			}

			tradeFee := big.NewRat(feeData.TradeFeeNumerator, feeData.TradeFeeDenominator)
			ownerTradeFee := big.NewRat(feeData.OwnerTradeFeeNumerator, feeData.OwnerTradeFeeDenominator)

			userSplAccountA := transaction.Transaction.Message.AccountKeys[instruction.Accounts[3]]

			userSplAccountB := transaction.Transaction.Message.AccountKeys[instruction.Accounts[6]]

			userSplAccountAPubkey := solana.MustPublicKeyFromBase58(userSplAccountA)

			userSplAccountBPubkey := solana.MustPublicKeyFromBase58(userSplAccountB)

			mintA, err := getMint(solanaClient, userSplAccountAPubkey)
			if err != nil {
				return nil, fmt.Errorf(
					"failed to get Orca spl-token mint A! %v",
					err,
				)
			}

			mintB, err := getMint(solanaClient, userSplAccountBPubkey)
			if err != nil {
				return nil, fmt.Errorf(
					"failed to get Orca spl-token mint B! %v",
					err,
				)
			}

			// check if the transaction involves a fluid token
			if !fluidity.IsFluidToken(mintA.String()) && !fluidity.IsFluidToken(mintB.String()) {
				continue
			}

			// if the first mint is a fluid token, use its non-fluid counterpart
			if fluidity.IsFluidToken(mintA.String()) {
				newMint, err := fluidity.GetBaseToken(mintA.String())
				if err != nil {
					return nil, fmt.Errorf(
						"failed to convert fluid token to base token! %v",
						err,
					)
				}

				mintA = solana.MustPublicKeyFromBase58(newMint)
			}

			price, _ := pyth.GetPriceByToken(solanaClient, mintA.String())

			if price == nil {
				continue
			}

			resp, err = solanaClient.GetAccountInfo(context.Background(), mintA)

			if err != nil {
				return nil, fmt.Errorf(
					"failed to get Orca user source spl-token mint! %v",
					err,
				)
			}

			data = resp.Value.Data.GetBinary()

			var decimals uint8

			err = borsh.Deserialize(&decimals, data[SplMintDecimalsStartByte:])

			if err != nil {
				return nil, fmt.Errorf(
					"issue deserialising token decimals! %v",
					err,
				)
			}

			var amountIn int64
			// int64 is 8 bytes
			err = borsh.Deserialize(&amountIn, inputBytes[1:9])
			if err != nil {
				return nil, fmt.Errorf(
					"issue deserialising Orca swap amountIn! %v",
					err,
				)
			}

			fee := big.NewRat(0, 1)

			amount := adjustDecimals(amountIn, int(decimals))

			// multiply by price
			amount = amount.Mul(amount, price)

			// remove fees
			fee = fee.Mul(amount, tradeFee)
			fee = fee.Add(fee, new(big.Rat).Mul(amount, ownerTradeFee))

			return fee, nil
		}
	}

	none := big.NewRat(0, 1)

	return none, nil
}

func adjustDecimals(rawAmount int64, decimals int) *big.Rat {
	// get integer value of denominator
	decimalsAdjusted := math.Pow10(decimals)

	// convert to decimal
	decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

	amount := big.NewRat(rawAmount, 1)

	// divide amount by 10^decimals
	amount = amount.Quo(amount, decimalsRat)

	return amount
}

func getMint(solanaClient *solanaRpc.Client, splAccount solana.PublicKey) (solana.PublicKey, error) {
	resp, err := solanaClient.GetAccountInfo(context.Background(), splAccount)

	if err != nil {
		return solana.PublicKey{}, fmt.Errorf(
			"failed to get spl-token account data from the RPC! %v",
			err,
		)
	}

	data := resp.Value.Data.GetBinary()

	// if there is not enough data for a public key
	if len(data) < 32 {
		return solana.PublicKey{}, fmt.Errorf(
			"spl-token account data shorter than expected!",
		)
	}

	var splData SplAccountTruncated

	err = borsh.Deserialize(&splData, data)

	if err != nil {
		return solana.PublicKey{}, fmt.Errorf(
			"issue deserialising spl-token account data! %v",
			err,
		)
	}

	return splData.Mint, nil
}
