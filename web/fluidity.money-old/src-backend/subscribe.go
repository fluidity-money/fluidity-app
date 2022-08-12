package main

import (
	"net/http"

	"github.com/fluidity-money/fluidity-app/lib/databases/postgres/website"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/log/discord"
	"github.com/fluidity-money/fluidity-app/lib/web"
)

func MakeHandleSubscribe(successUrl string) func(http.ResponseWriter, *http.Request) {
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

		emailAddress := r.Form.Get("email")

		if emailAddress == "" {
			log.App(func(k *log.Log) {
				k.Format(
					"Email address form supplied by user from IP %#v was empty!",
					ipAddress,
				)
			})

			return
		}

		subscription := website.Subscription{
			Email:  emailAddress,
			Source: website.SourceLanding,
		}

		website.InsertSubscription(subscription)

		http.Redirect(w, r, "/#success", http.StatusTemporaryRedirect)

		discord.Notify(
			discord.SeverityNotice,
			`
	A user has signed up with their email address at %#v!`,
			emailAddress,
		)
	}
}
