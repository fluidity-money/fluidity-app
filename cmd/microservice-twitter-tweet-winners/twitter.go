// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"strings"
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/types/network"

	ethCommon "github.com/ethereum/go-ethereum/common"
)

func prepareTweetRecipientIsContract(arbiscanKey string, network_ network.BlockchainNetwork, winAmount float64, tokenName string, winnerAddress ethCommon.Address) (string, error) {
	contractLabel, err := getArbiscanAddressLabel(winnerAddress.Hex(), arbiscanKey)

	if err != nil {
		return "", fmt.Errorf("failed to get arbiscan address label: %v", err)
	}

	hashtag := strings.ReplaceAll(contractLabel, " ", "")

	tweet := fmt.Sprintf(
		"%s received %v %v with #fluidity for using #%s! Learn more here %s #%s",
		winnerAddress.Hex(),
		winAmount,
		tokenName,
		hashtag,
		network_.String(),
	)

	return tweet, nil
}

func formatTweetSenderReceiver(senderAddress, recipientAddress ethCommon.Address, tokenName string, winAmount float64) string {
	return fmt.Sprintf(
		"%v received %v %v with #fluidity for sending to %v! #f%v is a pegged 1-to-1 asset that can be redeemed at any time for no cost.",
		senderAddress,
		winAmount,
		tokenName,
		recipientAddress,
	)
}
