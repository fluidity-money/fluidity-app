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
	FLU_ETHEREUM_HTTP_URL="$FLU_ETHEREUM_HTTP_URL" \
	FLU_ETHEREUM_ORACLE_ADDRESS=0x16243084bE83bdA3609998e79DD506AB2EF54628 \
	FLU_ETHEREUM_START_BLOCK=latest \
	FLU_ETHEREUM_UNISWAP_ANCHORED_VIEW_ADDR=0xbef4e076a995c784be6094a432b9ca99b7431a3f

export \
	FLU_ETHEREUM_CONTRACT_ADDR_FDAI=0xA4c2826Df07f0a37B125D5815B12Ff2f529a66e9 \
	FLU_ETHEREUM_CONTRACT_ADDR_DAI=0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD \
	FLU_ETHEREUM_TOKEN_NAME_FDAI=fDAI \
	FLU_ETHEREUM_TOKEN_NAME_DAI=DAI \
	FLU_ETHEREUM_TOKEN_DECIMALS_DAI=18 \
	FLU_ETHEREUM_ATOKEN_ADDR_DAI=0xdCf0aF9e59C002FA3AA091a46196b37530FD48a8 \
	FLU_ETHEREUM_AAVE_ADDRESS_PROVIDER_ADDR_DAI=0x88757f2f99175387aB4C6a4b3067c77A695b0349 \
	FLU_ETHEREUM_WORKER_GAS_LIMIT_DAI=$flu_ethereum_worker_hardhat_gas_limit \
	FLU_ETHEREUM_HARDHAT_FIX_DAI=false

export \
	FLU_ETHEREUM_CONTRACT_ADDR_TUSD=0x016750AC630F711882812f24Dba6c95b9D35856d \
	FLU_ETHEREUM_CONTRACT_ADDR_FTUSD= \
	FLU_ETHEREUM_TOKEN_NAME_TUSD=TUSD \
	FLU_ETHEREUM_TOKEN_NAME_FTUSD=fTUSD \
	FLU_ETHEREUM_TOKEN_DECIMALS_TUSD=18 \
	FLU_ETHEREUM_ATOKEN_ADDR_TUSD= \
	FLU_ETHEREUM_WORKER_GAS_LIMIT_TUSD=$flu_ethereum_worker_hardhat_gas_limit \
	FLU_ETHEREUM_HARDHAT_FIX_TUSD=false

export \
	FLU_ETHEREUM_CONTRACT_ADDR_USDT=0x13512979ADE267AB5100878E2e0f485B568328a4 \
	FLU_ETHEREUM_CONTRACT_ADDR_FUSDT= \
	FLU_ETHEREUM_TOKEN_NAME_USDT=USDT \
	FLU_ETHEREUM_TOKEN_NAME_FUSDT=fUSDT \
	FLU_ETHEREUM_TOKEN_DECIMALS_USDT=6 \
	FLU_ETHEREUM_ATOKEN_ADDR_USDT= \
	FLU_ETHEREUM_WORKER_GAS_LIMIT_USDT=$flu_ethereum_worker_hardhat_gas_limit \
	FLU_ETHEREUM_HARDHAT_FIX_USDT=false

export \
	FLU_ETHEREUM_CONTRACT_ADDR_USDC=0xe22da380ee6B445bb8273C81944ADEB6E8450422 \
	FLU_ETHEREUM_CONTRACT_ADDR_FUSDC= \
	FLU_ETHEREUM_TOKEN_NAME_USDC=USDC \
	FLU_ETHEREUM_TOKEN_NAME_FUSDC=fUSDC \
	FLU_ETHEREUM_TOKEN_DECIMALS_USDC=6 \
	FLU_ETHEREUM_ATOKEN_ADDR_USDC= \
	FLU_ETHEREUM_WORKER_GAS_LIMIT_USDC=$flu_ethereum_worker_hardhat_gas_limit \
	FLU_ETHEREUM_HARDHAT_FIX_USDC=false

export FLU_ETHEREUM_ETH_TOKEN_ADDR=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2

export FLU_ETHEREUM_HARDHAT_FIX=false

export \
	FLU_ETHEREUM_TOKENS_LIST=$FLU_ETHEREUM_CONTRACT_ADDR_FTUSD:$FLU_ETHEREUM_TOKEN_NAME_TUSD:$FLU_ETHEREUM_TOKEN_DECIMALS_TUSD,$FLU_ETHEREUM_CONTRACT_ADDR_FDAI:$FLU_ETHEREUM_TOKEN_NAME_DAI:$FLU_ETHEREUM_TOKEN_DECIMALS_DAI,$FLU_ETHEREUM_CONTRACT_ADDR_FUSDT:$FLU_ETHEREUM_TOKEN_NAME_USDT:$FLU_ETHEREUM_TOKEN_DECIMALS_USDT,$FLU_ETHEREUM_CONTRACT_ADDR_FUSDC:$FLU_ETHEREUM_TOKEN_NAME_USDC:$FLU_ETHEREUM_TOKEN_DECIMALS_USDC

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
