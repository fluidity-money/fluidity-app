// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package website

// questions asked by users in the portal

import (
	"fmt"

	logging "github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/postgres"
	"github.com/fluidity-money/fluidity-app/lib/types/website"
)

const (
	// Context to use when logging
	Context = "POSTGRES/WEBSITE"

	// TableQuestions to write to when writing questions asked by the users on
	// a public-facing website
	TableQuestions = "website_questions"

	// TableSubscriptions to use to handle subscriptions to the email list
	TableSubscriptions = "website_subscriptions"

	SourceLanding = website.SourceLanding
	SourceFaucet  = website.SourceFaucet
)

type (
	Question     = website.Question
	Subscription = website.Subscription
)

func InsertQuestion(question Question) {
	databaseClient := postgres.Client()

	questionStatementText := fmt.Sprintf(
		`INSERT INTO %s (
			name,
			email,
			question,
			source
		)

		VALUES (
			$1,
			$2,
			$3,
			$4
		);`,

		TableQuestions,
	)

	_, err := databaseClient.Exec(
		questionStatementText,
		question.Name,
		question.Email,
		question.Question,
		question.Source,
	)

	if err != nil {
		logging.Fatal(func(k *logging.Log) {
			k.Context = Context
			k.Message = "Failed to insert a website question!"
			k.Payload = err
		})
	}
}

func InsertSubscription(subscription Subscription) {
	databaseClient := postgres.Client()

	subscriptionStatementText := fmt.Sprintf(
		`INSERT INTO %s (
			email,
			source
		)

		VALUES (
			$1,
			$2
		);`,

		TableSubscriptions,
	)

	_, err := databaseClient.Exec(
		subscriptionStatementText,
		subscription.Email,
		subscription.Source,
	)

	if err != nil {
		logging.Fatal(func(k *logging.Log) {
			k.Context = Context
			k.Message = "Failed to insert a website subscription!"
			k.Payload = err
		})
	}
}
