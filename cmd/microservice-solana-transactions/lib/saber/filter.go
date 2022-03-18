package saber

import (
	"encoding/base64"
	"fmt"
	"math/big"
	"strconv"
	"strings"

	"github.com/fluidity-money/fluidity-app/lib/log"
	types "github.com/fluidity-money/fluidity-app/lib/types/solana"
	"github.com/gagliardetto/solana-go"
	"github.com/near/borsh-go"
)

const TokenAmountStartByte = 113

type TokenAmount struct {
	Mint   solana.PublicKey
	Amount uint64
}

func GetSaberFees(transaction types.TransactionResult, saberSwapProgramId string) *big.Rat {
	fees := big.NewRat(0, 1)
	logs := transaction.Meta.Logs

	searchString := fmt.Sprintf("Program %s consumed", saberSwapProgramId)

	for i, logStrings := range logs {
		if len(logStrings) > len(searchString) && logStrings[0:len(searchString)] == searchString[:] {
			swapMessage := logs[i-1]

			numStrings := strings.Split(swapMessage, " ")

			// ensure string is long enough
			if len(numStrings) < 7 {
				return fees
			}

			// get last log value
			numString := numStrings[6]

			if len(numString) < 3 {
				return fees
			}

			// parse from base 16
			numValue, err := strconv.ParseInt(numString[2:], 16, 64)

			if err != nil {
				return fees
			}

			routerMessage := logs[i+2]
			routerMessageWords := strings.Split(routerMessage, " ")

			routerMessageEncoded := routerMessageWords[2]

			routerBytes, err := base64.StdEncoding.DecodeString(routerMessageEncoded)
			if err != nil {
				log.Debug(func(k *log.Log) {
					k.Format("Failed to decode saber router debug message! %v", err)
				})
			}

			feeToken := new(TokenAmount)

			err = borsh.Deserialize(feeToken, routerBytes[TokenAmountStartByte:])

			priceRat, decimals, err := GetSaberPriceAndDecimals(feeToken.Mint.String())
			if err != nil {
				log.Debug(func(k *log.Log) {
					k.Format("Failed to get saber price! %v", err)
				})

				// default value so we don't get errors if this fails
				priceRat = big.NewRat(1, 1)
				decimals = 6
			}

			priceRat.Mul(priceRat, big.NewRat(numValue, 1))
			tenRat := big.NewRat(10, 1)
			for i := 0; i < decimals; i++ {
				priceRat.Quo(priceRat, tenRat)
			}

			fees.Add(fees, priceRat)
		}
	}

	return fees
}
