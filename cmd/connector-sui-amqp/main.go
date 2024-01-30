// Copyright 2024 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"context"

	"github.com/block-vision/sui-go-sdk/models"
	"github.com/block-vision/sui-go-sdk/sui"
	"github.com/block-vision/sui-go-sdk/utils"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
    EnvSuiWsUrl = `FLU_SUI_WS_URL`
)

func main() {
    var (
        suiWsUrl = util.GetEnvOrFatal(EnvSuiWsUrl)
    )

    var (
        client = sui.NewSuiWebsocketClient(suiWsUrl)
        ch     = make(chan(models.SuiEventResponse))
        ctx    = context.Background()
    )

    err := client.SubscribeEvent(
        ctx,
        models.SuiXSubscribeEventsRequest{
            // subscribe to all relevant events (separately?)
            // will need filters for fluid token send/swaps/wins, utility wins, application swaps
            SuiEventFilter: models.EventFilterByPackage{
                Package: "",
            },
        },
        ch,
    )

    if err != nil {
        log.Fatal(func(k *log.Log) {
            k.Message = "Failed to subscribe to Sui events!"
            k.Payload = err
        })
    }

    for {
        select {
        // receive Sui transaction effects
        case msg := <-ch:
            utils.PrettyPrint(msg)
            // send through amqp
        case <-ctx.Done():
            log.App(func(k *log.Log) {
                k.Message = "Context finished, quitting!"
            })
        return
        }
    }
}
