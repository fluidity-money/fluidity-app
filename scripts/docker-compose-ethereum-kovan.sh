#!/bin/sh -eu nounset

automation_dir=automation

flu_ethereum_worker_hardhat_gas_limit=8000000

export \
	FLU_AMQP_QUEUE_ADDR="$FLU_AMQP_QUEUE_ADDR" \
	FLU_UNIVERSE=production-ethereum-kovan

export \
	FLU_SENTRY_URL="$FLU_SENTRY_URL" \
	FLU_SLACK_WEBHOOK="$FLU_SLACK_WEBHOOK"

export \
	FLU_ETHEREUM_FRONTEND_API_URL=https://kovan.beta.fluidity.money:8081 \
	FLU_ETHEREUM_FRONTEND_WS_URL=wss://kovan.beta.fluidity.money:8081/updates \
	FLU_ETHEREUM_FRONTEND_CHAIN_ID=42 \
	FLU_ETHEREUM_FRONTEND_TOKEN_FILE=kovan-tokens.json \
	FLU_ETHEREUM_FRONTEND_GETH_URL="$FLU_ETHEREUM_FRONTEND_GETH_URL"

export \
	FLU_ETHEREUM_WS_URL="$FLU_ETHEREUM_WS_URL" \
	FLU_ETHEREUM_HTTP_URL= \
	FLU_ETHEREUM_ORACLE_ADDRESS=0x16243084bE83bdA3609998e79DD506AB2EF54628 \
	FLU_ETHEREUM_START_BLOCK=latest \
	FLU_ETHEREUM_UNISWAP_ANCHORED_VIEW_ADDR=0xbef4e076a995c784be6094a432b9ca99b7431a3f

export \
	FLU_ETHEREUM_CONTRACT_ADDR_FDAI=0x5ba8d8e005ade3a8333cf85c3bf2a0869d606569 \
	FLU_ETHEREUM_CONTRACT_ADDR_DAI=0x31f42841c2db5173425b5223809cf3a38fede360 \
	FLU_ETHEREUM_TOKEN_NAME_FDAI=fDAI \
	FLU_ETHEREUM_TOKEN_NAME_DAI=DAI \
	FLU_ETHEREUM_TOKEN_DECIMALS_DAI=18 \
	FLU_ETHEREUM_CTOKEN_ADDR_DAI=0xbc689667c13fb2a04f09272753760e38a95b998c \
	FLU_ETHEREUM_WORKER_GAS_LIMIT_DAI=$flu_ethereum_worker_hardhat_gas_limit \
	FLU_ETHEREUM_HARDHAT_FIX_DAI=false

export FLU_ETHEREUM_HARDHAT_FIX=false

export \
	FLU_ETHEREUM_TOKENS_LIST=$FLU_ETHEREUM_CONTRACT_ADDR_FDAI:$FLU_ETHEREUM_TOKEN_NAME_DAI:$FLU_ETHEREUM_TOKEN_DECIMALS_DAI

export \
	FLU_ETHEREUM_WORKER_PRIVATE_KEY_DAI="$FLU_ETHEREUM_WORKER_PRIVATE_KEY"

export \
	FLU_ETHEREUM_WORKER_HARDHAT_FIX_DAI=false

docker-compose \
	-f "$automation_dir/docker-compose.volumes.yml" \
	-f "$automation_dir/docker-compose.infrastructure.yml" \
	-f "$automation_dir/docker-compose.database-connectors.yml" \
	-f "$automation_dir/docker-compose.ethereum.yml" \
	-f "$automation_dir/docker-compose.ethereum.fluidity.money.yml" \
	-f "$automation_dir/docker-compose.ethereum-connectors.yml" \
	-f "$automation_dir/docker-compose.ethereum-worker-kovan.yml" \
	$@
