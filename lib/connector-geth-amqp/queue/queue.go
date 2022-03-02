package queue

import (
	"github.com/fluidity-money/fluidity-app/lib/queue"
	ethQueue "github.com/fluidity-money/fluidity-app/lib/queues/ethereum"
	types "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
)

// SendBlockHeader down microservice-lib/queues/ethereum.TopicBlockHeaders
// (ethereum.block.header)
func SendBlockHeader(header types.BlockHeader) {
	queue.SendMessage(ethQueue.TopicBlockHeaders, header)
}

// SendBlockBody down microservice-lib/queues/ethereum.TopicBlockBodies
// (ethereum.block.body)
func SendBlockBody(body types.BlockBody) {
	queue.SendMessage(ethQueue.TopicBlockBodies, body)
}

// SendBlock down microservice-lib/queues/ethereum.TopicBlocks
// (ethereum.block)
func SendBlock(block types.Block) {
	queue.SendMessage(ethQueue.TopicBlocks, block)
}

// SendTransaction down microservice-lib/queues/ethereum.TopicTransactions
// (ethereum.transaction)
func SendTransaction(transaction types.Transaction) {
	queue.SendMessage(ethQueue.TopicTransactions, transaction)
}

// SendLog down microservice-lib/queues/ethereum.TopicLogs (ethereum.log)
func SendLog(log types.Log) {
	queue.SendMessage(ethQueue.TopicLogs, log)
}
