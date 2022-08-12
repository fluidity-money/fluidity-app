package discord

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
	EnvWebhookAddress = "FLU_DISCORD_WEBHOOK"
)

// Levels of logging severity for Slack users to discern based on the border
// of the message
const (
	SeverityInformational = iota
	SeverityNotice
	SeverityAlarm
)

// slackWebhookMessage to send to Slack via a webhook
type discordWebhookMessage struct {
	Message string `json:"content"`
}

var webhookRequests = make(chan string)

// Notify the Slack in the specified channel, with the severity specified
// and a message. No guarantee to arrive in order!
func Notify(severity int, format string, arguments ...interface{}) {
	webhookAddress := <-webhookRequests

	workerId := util.GetWorkerId()

	formatted := fmt.Sprintf(format, arguments...)

	withWorker := fmt.Sprintf("%v: %v", workerId, formatted)

	message := discordWebhookMessage{
		Message: withWorker,
	}

	log.Debug(func(k *log.Log) {
		k.Context = Context

		k.Format(
			"Sending a Discord message, username %#v and message %#v!",
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
				"Failed to send a Discord message, username %#v and message %#v!",
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
				"Failed to POST a message to Discord, username %#v and message %#v!",
				workerId,
				message,
			)

			k.Payload = err
		})
	}

	defer resp.Body.Close()

	if reply := resp.StatusCode; reply != 204 {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				`Discord response status was not "204"! was %v!`,
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
