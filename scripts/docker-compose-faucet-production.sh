#!/bin/sh -e

export \
	FLU_AMQP_QUEUE_ADDR="$FLU_AMQP_QUEUE_ADDR" \
	FLU_UNIVERSE=production-faucet

export \
	FLU_FAUCET_FRONTEND_API_URL="$FLU_FAUCET_FRONTEND_API_URL" \
	FLU_TWITTER_HASHTAGS=fluiditymoney \
	FLU_ETHEREUM_FAUCET_PRIVATE_KEY="$FLU_ETHEREUM_FAUCET_PRIVATE_KEY" \
	FLU_TWITTER_BEARER_TOKEN="$FLU_TWITTER_BEARER_TOKEN"

export \
	FLU_SLACK_WEBHOOK_FAUCET_BACKEND=$FLU_SLACK_WEBHOOK \
	FLU_SLACK_WEBHOOK_FAUCET_TWEET="$FLU_SLACK_WEBHOOK_FAUCET_TWEET" \
	FLU_SLACK_WEBHOOK_FAUCET_AMOUNT_SENT="1"

export \
	FLU_SOLANA_RPC_URL="$FLU_SOLANA_RPC_URL" \
	FLU_SOLANA_WS_URL="$FLU_SOLANA_WS_URL" \
	FLU_SOLANA_PROGRAM_ID="$FLU_SOLANA_PROGRAM_ID" \
	FLU_SOLANA_FAUCET_PROGRAM_ID="$FLU_SOLANA_FAUCET_PROGRAM_ID" \
	FLU_SOLANA_FAUCET_SENDER_ADDR="$FLU_SOLANA_FAUCET_SENDER_ADDR"

docker-compose \
	-f "$automation_dir/docker-compose.infrastructure.yml" \
	-f "$automation_dir/docker-compose.database-connectors.yml" \
	-f "$automation_dir/docker-compose.faucet.fluidity.money.yml" \
	-f "$automation_dir/docker-compose.twitter-connectors.yml" \
	$@
