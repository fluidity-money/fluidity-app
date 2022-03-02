package erc20

// erc20 implements useful functions for receiving ERC20 token events

import (
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum/erc20"
)

// TopicTransfer to use to find ERC20 transfers
const TopicTransfer = `ethereum.erc20.transfer`

func Transfers(f func(erc20.Transfer)) {
	queue.GetMessages(TopicTransfer, func(message queue.Message) {
		var transfer erc20.Transfer

		message.Decode(&transfer)

		f(transfer)
	})
}
