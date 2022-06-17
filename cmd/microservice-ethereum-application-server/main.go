package main

import (
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/worker"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
)

func main() {
	worker.EthereumApplicationEvents(func(applicationEvent worker.EthereumApplicationEvent) {

		var (
			// transfers that generated application events
			applicationTransfers = applicationEvent.ApplicationTransfers

			// the block in question
			applicationBlock = applicationEvent.BlockLog

			// worker server has already found fluid transfers using the contract in this block
			fluidTransferCount = len(applicationTransfers)

			// transfers that we're adding information to
			decoratedTransfers = make([]worker.EthereumDecoratedTransfer, fluidTransferCount)
		)

		// loop over application events in the block, add payouts as decorator
		for i, transfer := range applicationTransfers {

			senderUtilityAmount, recipientUtilityAmount := governancePayoutCalculation()

			decorator := worker.EthereumWorkerDecorator{
				SenderUtilityMiningAmount:    *senderUtilityAmount,
				RecipientUtilityMiningAmount: *recipientUtilityAmount,
			}

			decoratedTransfer := worker.EthereumDecoratedTransfer{
				SenderAddress:    transfer.FromAddress,
				RecipientAddress: transfer.ToAddress,
				// added by the worker client
				SenderWinningAmount:    nil,
				RecipientWinningAmount: nil,
				Decorator:              decorator,
			}

			decoratedTransfers[i] = decoratedTransfer
		}

		serverWork := worker.EthereumServerWork{
			EthereumHintedBlock: &worker.EthereumHintedBlock{
				BlockHash:          applicationBlock.BlockHash,
				BlockBaseFee:       applicationBlock.BlockBaseFee,
				BlockTime:          applicationBlock.BlockTime,
				BlockNumber:        applicationBlock.BlockNumber,
				TransferCount:      fluidTransferCount,
				DecoratedTransfers: decoratedTransfers,
			},
		}

		// send to server
		queue.SendMessage(worker.TopicEthereumServerWork, serverWork)
	})
}

// governancePayoutCalculation that would determine how much the event has generated
func governancePayoutCalculation() (*misc.BigInt, *misc.BigInt) {
	panic("unimplemented!")
}
