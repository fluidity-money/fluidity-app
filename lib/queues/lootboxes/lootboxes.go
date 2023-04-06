// Copyright 2023 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package lootboxes

// winners contains queue code that receives winners picked up by an event
// and decodes it appropriately.

import (
	"github.com/fluidity-money/fluidity-app/lib/queue"
	types "github.com/fluidity-money/fluidity-app/lib/types/lootboxes"
)

const (
	TopicLootboxes = `lootboxes`
)

type (
	Lootbox = types.Lootbox
)

func LootboxesAll(f func(Lootbox)) {
	queue.GetMessages(TopicLootboxes, func(message queue.Message) {
		var lootbox Lootbox

		message.Decode(&lootbox)

		f(lootbox)
	})
}
