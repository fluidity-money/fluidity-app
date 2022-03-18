package saber

import (
	"encoding/base64"
	"fmt"
	"math/big"
	"strconv"
	"strings"

	types "github.com/fluidity-money/fluidity-app/lib/types/solana"
	"github.com/gagliardetto/solana-go"
	"github.com/near/borsh-go"
)

const TokenAmountStartByte = 113

type TokenAmount struct {
	Mint   solana.PublicKey
	Amount uint64
}

// GetSaberFees by breaking down the log message on the wire. Any errors
// returned from each stage of breaking down the logs are contained within
// an error slice, any lookup errors are returned in the final error type
func GetSaberFees(saberRpcUrl string, transaction types.TransactionResult, saberSwapProgramId string) (feesPaid *big.Rat, logErrors []error, err error) {

	logs := transaction.Meta.Logs

	logErrors = make([]error, len(logs))

	feesPaid = big.NewRat(0, 1)

	searchString := fmt.Sprintf("Program %s consumed", saberSwapProgramId)

	for i, logStrings := range logs {

		if !strings.HasPrefix(logStrings, searchString) {
			continue
		}

		swapMessage := logs[i-1]

		numStrings := strings.Split(swapMessage, " ")

		// ensure string is long enough

		if len(numStrings) < 7 {
			return feesPaid, logErrors, nil
		}

		// get last log value

		numString := numStrings[6]

		if len(numString) < 3 {
			return feesPaid, logErrors, nil
		}

		// parse from base 16

		numValue, err := strconv.ParseInt(numString[2:], 16, 64)

		if err != nil {
			logErrors[i] = fmt.Errorf(
				"failed to parse an int (%#v) on the saber wire with base 16! %v",
				numString[2:],
				err,
			)

			continue
		}

		routerMessage := logs[i+2]

		routerMessageWords := strings.Split(routerMessage, " ")

		routerMessageEncoded := routerMessageWords[2]

		routerBytes, err := base64.StdEncoding.DecodeString(routerMessageEncoded)

		if err != nil {
			logErrors[i] = fmt.Errorf(
				"failed to decode saber router debug message! %v",
				err,
			)

			continue
		}

		feeToken := new(TokenAmount)

		err = borsh.Deserialize(feeToken, routerBytes[TokenAmountStartByte:])

		priceRat, decimals, err := GetSaberPriceAndDecimals(
			saberRpcUrl,
			feeToken.Mint.String(),
		)

		if err != nil {
			return nil, logErrors, fmt.Errorf(
				"failed to get the saber price and its decimals! %v",
				err,
			)
		}

		priceRat.Mul(priceRat, big.NewRat(numValue, 1))

		tenRat := big.NewRat(10, 1)

		for i := 0; i < decimals; i++ {
			priceRat.Quo(priceRat, tenRat)
		}

		feesPaid.Add(feesPaid, priceRat)
	}

	return feesPaid, logErrors, nil
}
