// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package user_actions

// user_actions contains queue code that receives user actions

import (
	solApplications "github.com/fluidity-money/fluidity-app/common/solana/applications"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	user_actions "github.com/fluidity-money/fluidity-app/lib/types/user-actions"
)

const (
	networkEthereum = string(network.NetworkEthereum)
	networkSolana   = string(network.NetworkSolana)
	networkSui      = string(network.NetworkSui)
)

const (
	TopicUserActionsEthereum = `user_actions.` + networkEthereum
	TopicUserActionsSolana   = `user_actions.` + networkSolana
	TopicUserActionsSui      = `user_actions.` + networkSui
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

func NewSwapEthereum(network_ network.BlockchainNetwork, senderAddress ethereum.Address, transactionHash ethereum.Hash, amount misc.BigInt, swapIn bool, tokenShortName string, tokenDecimals int) UserAction {
	return user_actions.NewSwapEthereum(
		network_,
		senderAddress,
		transactionHash,
		amount,
		swapIn,
		tokenShortName,
		tokenDecimals,
	)
}

func NewSwapSolana(senderAddress, transactionHash string, amount misc.BigInt, swapIn bool, tokenShortName string, tokenDecimals int) UserAction {
	return user_actions.NewSwapSolana(
		senderAddress,
		transactionHash,
		amount,
		swapIn,
		tokenShortName,
		tokenDecimals,
	)
}

func NewSendEthereum(network_ network.BlockchainNetwork, senderAddress, recipientAddress ethereum.Address, transactionHash ethereum.Hash, amount misc.BigInt, tokenShortName string, tokenDecimals int, logIndex misc.BigInt, application applications.Application) UserAction {
	return user_actions.NewSendEthereum(
		network_,
		senderAddress,
		recipientAddress,
		transactionHash,
		amount,
		tokenShortName,
		tokenDecimals,
		logIndex,
		application,
	)
}

func NewSendSolana(senderAddress, recipientAddress, transactionHash string, amount misc.BigInt, tokenShortName string, tokenDecimals int, applications []solApplications.Application) UserAction {
	return user_actions.NewSendSolana(
		senderAddress,
		recipientAddress,
		transactionHash,
		amount,
		tokenShortName,
		tokenDecimals,
		applications,
	)
}

func userActions(topic string, f func(UserAction)) {
	queue.GetMessages(topic, func(message queue.Message) {
		var userAction UserAction

		message.Decode(&userAction)

		f(userAction)
	})
}

func UserActionsEthereum(f func(UserAction)) {
	userActions(TopicUserActionsEthereum, f)
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

func BufferedUserActionsEthereum(f func(BufferedUserAction)) {
	bufferedUserActions(TopicBufferedUserActionsEthereum, f)
}

func BufferedUserActionsSolana(f func(BufferedUserAction)) {
	bufferedUserActions(TopicBufferedUserActionsSolana, f)
}

func BufferedUserActionsAll(f func(BufferedUserAction)) {
	bufferedUserActions(topicBufferedUserActionsAll, f)
}
