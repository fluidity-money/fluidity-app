package main

import (
	"context"

	"github.com/fluidity-money/connector-geth-amqp/lib/geth"

	types "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/util"

	"golang.org/x/sync/errgroup"
)

// EnvEthereumWsUrl is the url to use to connect to the WS Geth endpoint
const EnvEthereumWsUrl = `FLU_ETHEREUM_WS_URL`

func main() {
	gethWebsocketUrl := util.GetEnvOrFatal(EnvEthereumWsUrl)

	// create the client

	gethClient, err := geth.NewClient(gethWebsocketUrl)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to connect to Geth Websocket!"
			k.Payload = err
		})
	}

	defer gethClient.Close()

	// subscribe to logs

	errs, contextGroup := errgroup.WithContext(
		context.Background(),
	)

	var (
		headerChan      = make(chan types.BlockHeader)
		bodyChan        = make(chan types.BlockBody)
		blockChan       = make(chan types.Block)
		transactionChan = make(chan types.Transaction)
	)

	blocksSubscription, err := gethClient.SubscribeBlocks(
		contextGroup,
		bodyChan,
		headerChan,
		blockChan,
		transactionChan,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Blocks subscription returned error!"
			k.Payload = err
		})
	}

	defer blocksSubscription.Unsubscribe()

	errs.Go(func() error {
		return gethClient.ProcessBlocks(
			contextGroup,
			blocksSubscription,
			bodyChan, headerChan,
			blockChan,
			transactionChan,
		)
	})

	// check for errors

	if err = errs.Wait(); err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to process logs or blocks!"
			k.Payload = err
		})
	}
}
