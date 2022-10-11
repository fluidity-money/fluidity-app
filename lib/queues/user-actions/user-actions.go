// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package user_actions

// user_actions contains queue code that receives user actions

import (
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	user_actions "github.com/fluidity-money/fluidity-app/lib/types/user-actions"
)

const (
	networkEthereum = string(network.NetworkEthereum)
	networkSolana   = string(network.NetworkSolana)
)

const (
	TopicUserActionsEthereum = `user_actions.` + networkEthereum
	TopicUserActionsSolana   = `user_actions.` + networkSolana
	topicUserActionsAll      = `user_actions.*`

	TopicBufferedUserActionsEthereum = `user_actions.buffered.` + networkEthereum
	TopicBufferedUserActionsSolana   = `user_actions.buffered.` + networkSolana
	topicBufferedUserActionsAll      = `user_actions.buffered.*`

	UserActionSend = user_actions.UserActionSend
	UserActionSwap = user_actions.UserActionSwap
)

type (
	UserAction         = user_actions.UserAction
	BufferedUserAction = user_actions.BufferedUserAction
)

func NewSwap(network network.BlockchainNetwork, userAddress, transactionHash string, amount misc.BigInt, swapIn bool, tokenShortName string, tokenDecimals int) UserAction {
	return user_actions.NewSwap(
		network,
		userAddress,
		transactionHash,
		amount,
		swapIn,
		tokenShortName,
		tokenDecimals,
	)
}

// NewSend, using the same code as the types equivalent of user actions
func NewSend(network network.BlockchainNetwork, senderAddress string, recipientAddress string, transactionHash string, amount misc.BigInt, tokenShortName string, tokenDecimals int) UserAction {
	return user_actions.NewSend(
		network,
		senderAddress,
		recipientAddress,
		transactionHash,
		amount,
		tokenShortName,
		tokenDecimals,
	)
}

func userActions(topic string, f func(UserAction)) {
	queue.GetMessages(topic, func(message queue.Message) {
		var userAction UserAction

		message.Decode(&userAction)

		f(userAction)
	})
}

func broadcastUserActions(topic string, f func(UserAction)) {
	queue.GetBroadcastMessages(topic, func(message queue.Message) {
		var userAction UserAction

		message.Decode(&userAction)

		f(userAction)
	})
}

func UserActionsEthereum(f func(UserAction)) {
	userActions(TopicUserActionsEthereum, f)
}

func BroadcastUserActionsEthereum(f func(UserAction)) {
	broadcastUserActions(TopicUserActionsEthereum, f)
}

func UserActionsSolana(f func(UserAction)) {
	userActions(TopicUserActionsSolana, f)
}

func UserActionsAll(f func(UserAction)) {
	userActions(topicUserActionsAll, f)
}

func bufferedUserActions(topic string, f func(BufferedUserAction)) {
	queue.GetMessages(topic, func(message queue.Message) {
		var bufferedUserAction BufferedUserAction

		message.Decode(&bufferedUserAction)

		f(bufferedUserAction)
	})
}

func broadcastBufferedUserActions(topic string, f func(BufferedUserAction)) {
	queue.GetBroadcastMessages(topic, func(message queue.Message) {
		var bufferedUserAction BufferedUserAction

		message.Decode(&bufferedUserAction)

		f(bufferedUserAction)
	})
}

func BufferedUserActionsEthereum(f func(BufferedUserAction)) {
	bufferedUserActions(TopicBufferedUserActionsEthereum, f)
}

func BufferedUserActionsSolana(f func(BufferedUserAction)) {
	bufferedUserActions(TopicBufferedUserActionsSolana, f)
}

func BroadcastBufferedUserActionsSolana(f func(BufferedUserAction)) {
	broadcastBufferedUserActions(TopicBufferedUserActionsSolana, f)
}

func BufferedUserActionsAll(f func(BufferedUserAction)) {
	bufferedUserActions(topicBufferedUserActionsAll, f)
}
