// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package user_updates

// user_updates contains messages used to inform web users of fluidity events

import (
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/user-updates"
)

const (
	TopicUserUpdatesEthereum = `user_updates.ethereum`
	TopicUserUpdatesSolana   = `user_updates.solana`
)

type Update = user_updates.Update

func userUpdates(topic string, f func(Update)) {
	queue.GetMessages(topic, func(message queue.Message) {
		var update Update

		message.Decode(&update)

		f(update)
	})
}

func UserUpdatesEthereum(f func(Update)) {
	userUpdates(TopicUserUpdatesEthereum, f)
}

func UserUpdatesSolana(f func(Update)) {
	userUpdates(TopicUserUpdatesSolana, f)
}
