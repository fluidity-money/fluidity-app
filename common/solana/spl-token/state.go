package spl_token

import (
	"context"
	"fmt"
	"math"
	"math/big"

	"github.com/gagliardetto/solana-go"
	solanaRpc "github.com/gagliardetto/solana-go/rpc"
	"github.com/near/borsh-go"
)

type (
	// SplAccountTruncated is a truncated version of the spl-token
	// account struct, used to get the mint and decimals of a token account
	SplAccountTruncated struct {
		Mint     solana.PublicKey
		Supply   uint64
		Decimals uint8
	}
)

// SplAccountTruncatedSize is the number of bytes required to encode the data
// in SplAccountTruncated
const SplAccountTruncatedSize = 41

func GetMintAndDecimals(solanaClient *solanaRpc.Client, splAccount solana.PublicKey) (solana.PublicKey, uint8, error) {
	resp, err := solanaClient.GetAccountInfo(context.Background(), splAccount)

	if err != nil {
		return solana.PublicKey{}, 0, fmt.Errorf(
			"failed to get spl-token account data from the RPC! %v",
			err,
		)
	}

	data := resp.Value.Data.GetBinary()

	// if there is not enough data to contain the struct
	if len(data) < SplAccountTruncatedSize {
		return solana.PublicKey{}, 0, fmt.Errorf(
			"spl-token account data shorter than expected!",
		)
	}

	var splData SplAccountTruncated

	err = borsh.Deserialize(&splData, data)

	if err != nil {
		return solana.PublicKey{}, 0, fmt.Errorf(
			"issue deserialising spl-token account data! %v",
			err,
		)
	}

	return splData.Mint, splData.Decimals, nil 
}

func AdjustDecimals(rawAmount int64, decimals int) *big.Rat {
	// get integer value of denominator
	decimalsAdjusted := math.Pow10(decimals)

	// convert to decimal
	decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

	amount := big.NewRat(rawAmount, 1)

	// divide amount by 10^decimals
	amount = amount.Quo(amount, decimalsRat)

	return amount
}
