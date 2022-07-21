// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package slack

// notify channels in our Slack using a single function

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// Context to use when logging
	Context = "SLACK"

	// EnvWebhookAddress to use to relay Slack messages to the chat
	EnvWebhookAddress = "FLU_SLACK_WEBHOOK"
)

// Channels that the user might post in
const (
	ChannelGeneral            = "#general"
	ChannelDevops             = "#devops"
	ChannelWebsite            = "#website"
	ChannelQuestions          = "#questions"
	ChannelWinnings           = "#winnings"
	ChannelFaucetTweets       = "#faucet-tweets"
	ChannelProductionFailures = "#production-failures"
	ChannelTopWinners         = "#top-winners"
	ChannelPayroll            = "#payroll"
)

// Levels of logging severity for Slack users to discern based on the border
// of the message
const (
	SeverityInformational = iota
	SeverityNotice
	SeverityAlarm
)

// slackWebhookMessage to send to Slack via a webhook
type slackWebhookMessage struct {
	Channel  string `json:"channel"`
	Message  string `json:"text"`
	Username string `json:"username"`
}

var webhookRequests = make(chan string)

// Notify the Slack in the specified channel, with the severity specified
// and a message. No guarantee to arrive in order!
func Notify(channel string, severity int, format string, arguments ...interface{}) {
	webhookAddress := <-webhookRequests

	workerId := util.GetWorkerId()

	formatted := fmt.Sprintf(format, arguments...)

	message := slackWebhookMessage{
		Channel:  channel,
		Message:  formatted,
		Username: workerId,
	}

	log.Debug(func(k *log.Log) {
		k.Context = Context

		k.Format(
			"Sending a Slack message to channel %#v, username %#v and message %#v!",
			channel,
			workerId,
			message,
		)
	})

	var buf bytes.Buffer

	err := json.NewEncoder(&buf).Encode(message)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to send a msesage to Slack channel %#v, username %#v and message %#v!",
				channel,
				workerId,
				message,
			)

			k.Payload = err
		})
	}

	resp, err := http.Post(webhookAddress, "application/json", &buf)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to POST a message to Slack, channel %#v, username %#v and message %#v!",
				channel,
				workerId,
				message,
			)

			k.Payload = err
		})
	}

	defer resp.Body.Close()

	var respBuf bytes.Buffer

	if _, err := respBuf.ReadFrom(resp.Body); err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to read the reply from Slack webhook!"
			k.Payload = err
		})
	}

	if reply := respBuf.String(); reply != "ok" {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				`Slack reply was not "ok"! was %v!`,
				reply,
			)
		})
	}
}

func init() {
	webhookUrl := util.GetEnvOrFatal(EnvWebhookAddress)

	go func() {
		for {
			webhookRequests <- webhookUrl
		}
	}()
}
