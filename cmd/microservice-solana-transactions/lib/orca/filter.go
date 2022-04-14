package orca

import (
	"context"
	"math"
	"math/big"

	"github.com/fluidity-money/fluidity-app/common/solana/pyth"
	"github.com/fluidity-money/fluidity-app/lib/log"
	types "github.com/fluidity-money/fluidity-app/lib/types/solana"

	"github.com/btcsuite/btcutil/base58"
	"github.com/gagliardetto/solana-go"
	solanaRpc "github.com/gagliardetto/solana-go/rpc"
	"github.com/near/borsh-go"
)

// Byte offset at which the curve data is stored
const CurveDataStartByte = 195

// Enum variant of swap instruction 
const SwapVariant = 1

type ConstantProductCurveFeeData struct {
	TradeFeeNumerator        int64
	TradeFeeDenominator      int64
	OwnerTradeFeeNumerator   int64
	OwnerTradeFeeDenominator int64
}

type SplAccountTruncated struct {
	Mint solana.PublicKey
}

type SplMintTruncated struct {
	MintAuthority *solana.PublicKey
	Supply int64
	Decimals uint8
}

// GetOrcaFee by checking that an orca swap occurred, then
// destructuring the swap information to get the fee %, and
// getting the fee paid by multiplying the value of the swap
func GetOrcaFee(solanaClient *solanaRpc.Client, transaction types.TransactionResult, orcaProgramId string) (feePaid *big.Rat, err error) {
	instructions := transaction.Transaction.Message.Instructions
	
	for i, instruction := range instructions {
		if transaction.Transaction.Message.AccountKeys[instruction.ProgramIdIndex] == orcaProgramId {
			// make sure it's a swap instruction
			inputBytes := base58.Decode(instruction.Data)
			if inputBytes[0] != SwapVariant {
				continue
			}
			
			swapAccount := transaction.Transaction.Message.AccountKeys[instruction.Accounts[i]]
			swapAccountPubkey := solana.MustPublicKeyFromBase58(swapAccount)

			var feeData ConstantProductCurveFeeData

			err := solanaClient.GetAccountDataBorshInto(context.Background(), swapAccountPubkey, &feeData)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Message = "Failed to get Orca swap data account!"
					k.Payload = err
				})
			}

			tradeFee := big.NewRat(feeData.TradeFeeNumerator, feeData.TradeFeeDenominator)
			ownerTradeFee := big.NewRat(feeData.OwnerTradeFeeNumerator, feeData.OwnerTradeFeeDenominator)

			userSplAccount := transaction.Transaction.Message.AccountKeys[instruction.Accounts[3]]
			userSplAccountPubkey := solana.MustPublicKeyFromBase58(userSplAccount)

			var splData SplAccountTruncated

			err = solanaClient.GetAccountDataBorshInto(context.Background(), userSplAccountPubkey, &splData)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Message = "Failed to get Orca user source spl-token account"
					k.Payload = err
				})
			}

			price, err := pyth.GetPrice(solanaClient, splData.Mint) 
			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Format("Failed to get Pyth price for token %v!", splData.Mint)
					k.Payload = err
				})
			}

			var splMint SplMintTruncated

			err = solanaClient.GetAccountDataBorshInto(context.Background(), splData.Mint, &splMint)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Message = "Failed to get Orca user source spl-token mint"
					k.Payload = err
				})
			}

			decimalsAdjusted := math.Pow10(int(splMint.Decimals))
			decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

			var amountIn int64
			// int64 is 8 bytes
			borsh.Deserialize(&amountIn, inputBytes[1:9])
			fee := big.NewRat(amountIn,1)
			fee = fee.Quo(fee, decimalsRat)

			// multiply by price
			fee = fee.Mul(fee, price)

			// remove fees
			fee = fee.Sub(fee, fee.Mul(fee, tradeFee))
			fee = fee.Sub(fee, fee.Mul(fee, ownerTradeFee))

			return fee, nil
		}
	}

	none := big.NewRat(0,1)

	return none, nil
}
