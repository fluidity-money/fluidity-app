package main

import (
	"github.com/fluidity-money/fluidity-app/lib/databases/postgres/solana"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queues/user-actions"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
)

func main() {
	user_actions.BufferedUserActionsSolana(func(bufferedUserAction user_actions.BufferedUserAction) {
		userActions := bufferedUserAction.UserActions

		for _, userAction := range userActions {
			var (
				network_        = userAction.Network
				transactionHash = userAction.TransactionHash
				swapIn          = userAction.SwapIn
				senderAddress   = userAction.SenderAddress
				amount          = userAction.Amount
				tokenDetails    = userAction.TokenDetails
			)

			if network_ != network.NetworkSolana {
				log.Debugf(
					"Network for transaction hash %#v was not Solana! Was %#v!",
					transactionHash,
					network_,
				)

				continue
			}

			tokenName := tokenDetails.TokenShortName

			log.Debug(func(k *log.Log) {
				k.Format(
					"Transaction hash %v, token name %v, unnormalised amount %v swapped in: %v",
					transactionHash,
					tokenName,
					amount,
					swapIn,
				)
			})

			// the user swapped in, so we increase the user's minted amount

			if swapIn {
				solana.AddMintUserLimit(senderAddress, amount)
			} else {
				solana.ReduceMintUserLimit(senderAddress, amount)
			}
		}
	})
}
