package main

import (
	"net/http"

	"github.com/fluidity-money/fluidity-app/lib/databases/postgres/website"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/log/discord"
	"github.com/fluidity-money/fluidity-app/lib/web"
)

func MakeHandleAskQuestion(successUrl string) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		ipAddress := web.GetIpAddress(r)

		if err := r.ParseForm(); err != nil {
			log.App(func(k *log.Log) {
				k.Format(
					"Failed to parse a form from IP %#v!",
					ipAddress,
				)

				k.Payload = err
			})

			return
		}

		var (
			name         = r.Form.Get("lets-talk-name")
			emailAddress = r.Form.Get("lets-talk-email")
			message      = r.Form.Get("lets-talk-message")
		)

		switch "" {
		case name:
			fallthrough

		case emailAddress:
			fallthrough

		case message:
			log.App(func(k *log.Log) {
				k.Format(
					"Form input provided by user at %#v was empty! User %#v, email %#v, message %#v",
					ipAddress,
					name,
					emailAddress,
					message,
				)
			})

			return
		}

		question := website.Question{
			Name:     name,
			Email:    emailAddress,
			Question: message,
			Source:   website.SourceFaucet,
		}

		website.InsertQuestion(question)

		discord.Notify(
			discord.SeverityNotice,
			`
	A user with the name %#v and the email %#v has asked the following question:

	%#v`,
			name,
			emailAddress,
			message,
		)

		http.Redirect(w, r, "/#success", http.StatusTemporaryRedirect)
	}
}
