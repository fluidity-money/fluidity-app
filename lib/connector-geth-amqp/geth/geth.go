package geth

import (
	"context"
	"fmt"
	"time"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/ethclient"
	ethEvent "github.com/ethereum/go-ethereum/event"

	ethConvert "github.com/fluidity-money/connector-geth-amqp/lib/ethereum"
	queue "github.com/fluidity-money/connector-geth-amqp/lib/queue"

	newTypes "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/log"
)

type GethClient struct {
	client *ethclient.Client
}

// estimate blocktime
const blockTimeSec = uint64(10)

// create a new wrapped client connected to the provided url
func NewClient(wsUrl string) (GethClient, error) {
	ethClient, err := ethclient.Dial(wsUrl)

	if err != nil {
		return GethClient{}, err
	}

	return GethClient{client: ethClient}, nil
}

func (client *GethClient) Close() {
	client.client.Close()
}

// runs a loop to process new blocks on a regular interval, posting the results into channels
func (client *GethClient) fetchBlocks(ctx context.Context, bodyChan chan newTypes.BlockBody, headerChan chan newTypes.BlockHeader, blockChan chan newTypes.Block, transactionChan chan newTypes.Transaction, errChan chan error) {

	// start from the most recent block

	prevBlockNum, err := client.client.BlockNumber(ctx)

	if err != nil {
		errChan <- fmt.Errorf(
			"Failed to fetch initial block number! %v",
			err,
		)
		return
	}

	for {
		// get the current block
		blockNumber, err := client.client.BlockNumber(ctx)

		if err != nil {
			errChan <- fmt.Errorf(
				"Failed to fetch block number! %v",
				err,
			)
			return
		}

		// look at the block after the one we've processed most recently
		var (
			nextBlock      = uint64ToBigInt(prevBlockNum + 1)
			hasIncremented = blockNumber > prevBlockNum
		)

		// there is at least one new block
		if hasIncremented {
			block, err := client.client.BlockByNumber(ctx, &nextBlock)

			// sometimes the block will be fetched slightly before finalisation
			// so if retrieval fails retry on a short delay
			for tries := 0; err != nil; tries++ {
				if tries >= 10 {
					log.Fatal(func(k *log.Log) {
						k.Message = fmt.Sprintf(
							"Failed to find block %v after %v tries",
							nextBlock.Int64(),
							tries,
						)
						k.Payload = err
					})
				}

				log.Debug(func(k *log.Log) {
					k.Message = fmt.Sprintf(
						"Block %v not found - trying again (%d)",
						nextBlock.Int64(),
						tries,
					)
				})

				time.Sleep(7)
				block, err = client.client.BlockByNumber(ctx, &nextBlock)
			}

			if err != nil {
				errChan <- fmt.Errorf(
					"Failed to fetch block %v! %v",
					nextBlock.Int64(),
					err,
				)
				return
			}

			// convert the block to a form the message queue expects

			newBlock, err := ethConvert.ConvertBlock(block)

			if err != nil {
				errChan <- fmt.Errorf(
					"Failed to convert block to queueable! %v",
					err,
				)

				return
			}

			// post down channels

			if block == nil {
				// this won't happen, but it's good to be cautious

				errChan <- fmt.Errorf(
					"Block received from geth is empty!",
				)

				return
			}

			blockChan <- *newBlock
			bodyChan <- newBlock.Body
			headerChan <- newBlock.Header

			go func() {
				for _, transaction := range newBlock.Body.Transactions {
					transactionChan <- transaction
				}
			}()

			// move to the next block
			prevBlockNum += 1
		}

		// if there's no new blocks, poll at regular intervals
		// otherwise, keep requesting until we're up to date
		if prevBlockNum == blockNumber {
			time.Sleep(time.Second * time.Duration(blockTimeSec))
		}
	}
}

// subscribe to every new block, separating headers and blocks there's no
// actual RPC subscription for blocks, so instead we query for new blocks
// on a regular interval
func (client *GethClient) SubscribeBlocks(ctx context.Context, bodyChan chan newTypes.BlockBody, headerChan chan newTypes.BlockHeader, blockChan chan newTypes.Block, transactionChan chan newTypes.Transaction) (ethereum.Subscription, error) {
	errChan := make(chan error)

	// run fetch loop
	go client.fetchBlocks(ctx, bodyChan, headerChan, blockChan, transactionChan, errChan)

	// return as a subscription to allow handling like other log types
	subscription := ethEvent.NewSubscription(func(quit <-chan struct{}) error {
		for {
			select {
			case <-quit:
				return nil
			case err := <-errChan:
				return err
			}
		}
	})

	return subscription, nil
}

// process blocks and post to rabbitmq
func (client *GethClient) ProcessBlocks(ctx context.Context, blocksSubscription ethereum.Subscription, bodyChan chan newTypes.BlockBody, headerChan chan newTypes.BlockHeader, blockChan chan newTypes.Block, transactionChan chan newTypes.Transaction) error {
	for {
		select {
		case err := <-blocksSubscription.Err():
			return fmt.Errorf(
				"Block subscription returned error! %v",
				err,
			)

		case block := <-blockChan:
			queue.SendBlock(block)

		case blockHeader := <-headerChan:
			queue.SendBlockHeader(blockHeader)

		case blockBody := <-bodyChan:
			queue.SendBlockBody(blockBody)

		case transaction := <-transactionChan:
			queue.SendTransaction(transaction)

		case <-ctx.Done():
			return ctx.Err()
		}
	}
}
