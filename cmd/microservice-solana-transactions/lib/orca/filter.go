package orca

import (
	"context"
	"math"
	"math/big"
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/log"
	types "github.com/fluidity-money/fluidity-app/lib/types/solana"
	//"github.com/fluidity-money/fluidity-app/common/solana/fluidity"
	"github.com/fluidity-money/fluidity-app/common/solana/pyth"

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
				log.Fatal(func(k *log.Log) {
					k.Message = "Failed to get Orca swap data account!"
					k.Payload = err
				})
			}

			var feeData ConstantProductCurveFeeData

			data := resp.Value.Data.GetBinary()

			if len(data) < CurveDataStartByte + 32 {
				continue
			}

			borsh.Deserialize(&feeData, data[CurveDataStartByte:])

			tradeFee := big.NewRat(feeData.TradeFeeNumerator, feeData.TradeFeeDenominator)
			ownerTradeFee := big.NewRat(feeData.OwnerTradeFeeNumerator, feeData.OwnerTradeFeeDenominator)

			userSplAccountA := transaction.Transaction.Message.AccountKeys[instruction.Accounts[3]]
			userSplAccountAPubkey := solana.MustPublicKeyFromBase58(userSplAccountA)

			userSplAccountB := transaction.Transaction.Message.AccountKeys[instruction.Accounts[6]]
			userSplAccountBPubkey := solana.MustPublicKeyFromBase58(userSplAccountB)

			mintA := getMint(solanaClient, userSplAccountAPubkey)
			mintB := getMint(solanaClient, userSplAccountBPubkey)

			if mintA.IsZero() && mintB.IsZero() {
				continue
			}

			// check if the transaction involves a fluid token
			/*
			if !fluidity.IsFluidToken(mintA.String()) && !fluidity.IsFluidToken(mintB.String()) {
				continue
			}*/

			price, _ := pyth.GetPriceByToken(solanaClient, mintA.String())

			if price == nil {
				continue
			}

			resp, err = solanaClient.GetAccountInfo(context.Background(), mintA)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Message = "Failed to get Orca user source spl-token mint"
					k.Payload = err
				})
			}

			data = resp.Value.Data.GetBinary()

			var decimals uint8

			borsh.Deserialize(&decimals, data[SplMintDecimalsStartByte:])

			decimalsAdjusted := math.Pow10(int(decimals))
			decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

			var amountIn int64
			// int64 is 8 bytes
			borsh.Deserialize(&amountIn, inputBytes[1:9])
			amount := big.NewRat(amountIn,1)
			amount = amount.Quo(amount, decimalsRat)

			// multiply by price
			amount = amount.Mul(amount, price)

			fee := big.NewRat(0, 1)

			// remove fees
			fee = fee.Add(fee, amount.Mul(amount, tradeFee))
			fee = fee.Add(fee, amount.Mul(amount, ownerTradeFee))

			fmt.Println(transaction.Transaction.Signatures)
			fmt.Println("fee", fee)

			return fee, nil
		}
	}

	none := big.NewRat(0,1)

	return none, nil
}

func getMint(solanaClient *solanaRpc.Client, splAccount solana.PublicKey) (solana.PublicKey){
	resp, err := solanaClient.GetAccountInfo(context.Background(), splAccount)

	if err != nil {
		return solana.PublicKey{}
	}

	data := resp.Value.Data.GetBinary()

	// if there is not enough data for a public key
	if len(data) < 32 {
		return solana.PublicKey{}
	}

	var splData SplAccountTruncated

	borsh.Deserialize(&splData, data)

	return splData.Mint
}
