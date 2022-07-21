// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package saber

import (
	"encoding/base64"
	"fmt"
	"math/big"
	"strconv"
	"strings"

	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/gagliardetto/solana-go"
	"github.com/near/borsh-go"
)

// Byte offset at which the TokenAmount struct we're interested in starts
const TokenAmountStartByte = 113

type TokenAmount struct {
	Mint   solana.PublicKey
	Amount uint64
}

// GetSaberFees by breaking down the log message on the wire. Any errors
// returned from each stage of breaking down the logs are contained within
// an error slice, any lookup errors are returned in the final error type
func GetSaberFees(saberRpcUrl string, transaction worker.SolanaParsedTransaction, saberSwapProgramId string) (feesPaid *big.Rat, logErrors []error, err error) {

	logs := transaction.Transaction.Result.Meta.Logs

	logErrors = make([]error, len(logs))

	feesPaid = big.NewRat(0, 1)

	searchString := fmt.Sprintf("Program %s consumed", saberSwapProgramId)

	for i, logStrings := range logs {

		if !strings.HasPrefix(logStrings, searchString) {
			continue
		}

		// we need i-1 and i+2
		if i < 1 {
			continue
		}
		if len(logs) < i+3 {
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

		// 32 bytes for public key, and 8 for uint64
		if len(routerBytes) < (TokenAmountStartByte + 40) {
			continue
		}

		feeToken := new(TokenAmount)

		err = borsh.Deserialize(feeToken, routerBytes[TokenAmountStartByte:])

		priceRat, decimals, err := GetSaberPriceAndDecimals(
			saberRpcUrl,
			feeToken.Mint.String(),
		)

		if err != nil {
			return feesPaid, logErrors, fmt.Errorf(
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
