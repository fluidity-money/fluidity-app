#!/bin/sh -e

automation_dir=automation

flu_ethereum_worker_hardhat_gas_limit=8000000

export \
	FLU_AMQP_QUEUE_ADDR="$FLU_AMQP_QUEUE_ADDR" \
	FLU_UNIVERSE=production-ethereum-ropsten

export \
	FLU_SENTRY_URL="$FLU_SENTRY_URL" \
	FLU_SLACK_WEBHOOK="$FLU_SLACK_WEBHOOK"

export \
	FLU_ETHEREUM_FRONTEND_API_URL=https://ropsten.beta.fluidity.money:8081 \
	FLU_ETHEREUM_FRONTEND_WS_URL=wss://ropsten.beta.fluidity.money:8081/updates \
	FLU_ETHEREUM_FRONTEND_CHAIN_ID=3 \
	FLU_ETHEREUM_FRONTEND_TOKEN_FILE=ropsten-tokens.json \
	FLU_ETHEREUM_FRONTEND_GETH_URL="$FLU_ETHEREUM_FRONTEND_GETH_URL"

export \
	FLU_ETHEREUM_WS_URL="$FLU_ETHEREUM_WS_URL" \
	FLU_ETHEREUM_HTTP_URL="$FLU_ETHEREUM_HTTP_URL" \
	FLU_ETHEREUM_ORACLE_ADDRESS=0x50ab74ed0dac2f82924d6e748ce22ebee339184c \
	FLU_ETHEREUM_START_BLOCK="$FLU_ETHEREUM_START_BLOCK" \
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

export \
	FLU_ETHEREUM_CONTRACT_ADDR_FUSDC=0x2835bed5db82f84180ecbc7de7c1944e154b1035 \
	FLU_ETHEREUM_CONTRACT_ADDR_USDC=0x07865c6e87b9f70255377e024ace6630c1eaa37f \
	FLU_ETHEREUM_TOKEN_NAME_FUSDC=fUSDC \
	FLU_ETHEREUM_TOKEN_NAME_USDC=USDC \
	FLU_ETHEREUM_TOKEN_DECIMALS_USDC=6 \
	FLU_ETHEREUM_CTOKEN_ADDR_USDC=0x2973e69b20563bcc66dC63Bde153072c33eF37fe \
	FLU_ETHEREUM_WORKER_GAS_LIMIT_USDC=$flu_ethereum_worker_hardhat_gas_limit \
	FLU_ETHEREUM_HARDHAT_FIX_USDC=false

export \
	FLU_ETHEREUM_CONTRACT_ADDR_FUSDT=0x26fc224b37952bd12c792425f242e0b0a55453a6 \
	FLU_ETHEREUM_CONTRACT_ADDR_USDT=0x110a13fc3efe6a245b50102d2d79b3e76125ae83 \
	FLU_ETHEREUM_TOKEN_NAME_FUSDT=fUSDT \
	FLU_ETHEREUM_TOKEN_NAME_USDT=USDT \
	FLU_ETHEREUM_TOKEN_DECIMALS_USDT=6 \
	FLU_ETHEREUM_CTOKEN_ADDR_USDT=0xF6958Cf3127e62d3EB26c79F4f45d3F3b2CcdeD4 \
	FLU_ETHEREUM_WORKER_GAS_LIMIT_USDT=$flu_ethereum_worker_hardhat_gas_limit \
	FLU_ETHEREUM_HARDHAT_FIX_USDT=true

export FLU_ETHEREUM_HARDHAT_FIX=false

export \
	FLU_ETHEREUM_TOKENS_LIST=$FLU_ETHEREUM_CONTRACT_ADDR_FUSDT:$FLU_ETHEREUM_TOKEN_NAME_USDT:$FLU_ETHEREUM_TOKEN_DECIMALS_USDT,$FLU_ETHEREUM_CONTRACT_ADDR_FUSDC:$FLU_ETHEREUM_TOKEN_NAME_USDC:$FLU_ETHEREUM_TOKEN_DECIMALS_USDT,$FLU_ETHEREUM_CONTRACT_ADDR_FDAI:$FLU_ETHEREUM_TOKEN_NAME_DAI:$FLU_ETHEREUM_TOKEN_DECIMALS_DAI

export \
	FLU_ETHEREUM_WORKER_PRIVATE_KEY_LIST="$FLU_ETHEREUM_TOKEN_NAME_USDT:$FLU_ETHEREUM_WORKER_PRIVATE_KEY_USDT,$FLU_ETHEREUM_TOKEN_NAME_USDC:$FLU_ETHEREUM_WORKER_PRIVATE_KEY_USDC,$FLU_ETHEREUM_TOKEN_NAME_USDC:$FLU_ETHEREUM_WORKER_PRIVATE_KEY_DAI"

export \
	FLU_ETHEREUM_SPOOLER_INSTANT_REWARD_THRESHOLD=1 \
	FLU_ETHEREUM_SPOOLER_TOTAL_REWARD_THRESHOLD=1

export \
	FLU_ETHEREUM_WORKER_HARDHAT_FIX_DAI=false \
	FLU_ETHEREUM_WORKER_HARDHAT_FIX_USDC=false \
	FLU_ETHEREUM_WORKER_HARDHAT_FIX_USDT=false

docker-compose \
	-f "$automation_dir/docker-compose.volumes.yml" \
	-f "$automation_dir/docker-compose.infrastructure.yml" \
	-f "$automation_dir/docker-compose.database-connectors.yml" \
	-f "$automation_dir/docker-compose.ethereum.yml" \
	-f "$automation_dir/docker-compose.ethereum.fluidity.money.yml" \
	-f "$automation_dir/docker-compose.ethereum-connectors.yml" \
	-f "$automation_dir/docker-compose.ethereum-ropsten.yml" \
	-f "$automation_dir/docker-compose.ethereum-worker-ropsten.yml" \
	-f "$automation_dir/docker-compose.ethereum-applications-ropsten.yml" \
	$@
