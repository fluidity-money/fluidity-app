package main

import (
	"encoding/json"
	"net/http"

	"github.com/fluidity-money/fluidity-app/lib/databases/postgres/website"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/log/slack"
	"github.com/fluidity-money/fluidity-app/lib/web"
)

type (
	QuestionRequest struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Question string `json:"question"`
	}

	QuestionResponse struct {
		// Status will always be "okay"!
		Status string `json:"status"`
	}
)

func HandleSubmitQuestion(w http.ResponseWriter, r *http.Request) interface{} {
	var (
		ipAddress = web.GetIpAddress(r)

		questionRequest QuestionRequest
	)

	err := json.NewDecoder(r.Body).Decode(&questionRequest)

	if err != nil {
		log.App(func(k *log.Log) {
			k.Format(
				"Failed to decode a message from IP address %#v!",
				ipAddress,
			)

			k.Payload = err
		})

		return nil
	}

	var (
		name     = questionRequest.Name
		email    = questionRequest.Email
		question = questionRequest.Question

		source = website.SourceFaucet
	)

	faucetQuestion := website.Question{
		Name:     name,
		Email:    email,
		Question: question,
		Source:   source,
	}

	website.InsertQuestion(faucetQuestion)

	slack.Notify(
		slack.ChannelQuestions,
		slack.SeverityInformational,
		`
User at ip address %#v, name %#v and email %#v has left a question!

%#v`,
		ipAddress,
		name,
		email,
		question,
	)

	questionResponse := QuestionResponse{
		Status: "okay",
	}

	return questionResponse
}
