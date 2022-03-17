#!/bin/sh

automation_dir=automation

flu_ethereum_worker_hardhat_gas_limit=8000000

worker_private_key="2de6137a159eabaeef895e884b1f9e2a9af2c0c50a1f5495b8d72086ac26f0a4"

export \
	FLU_AMQP_QUEUE_ADDR=amqp://fluidity:fluidity@rabbitmq \
	FLU_UNIVERSE=testing

export \
	FLU_ETHEREUM_WS_URL=ws://contracts-ethereum:8545 \
	FLU_ETHEREUM_HTTP_URL=http://contracts-ethereum:8545 \
	FLU_ETHEREUM_ORACLE_ADDRESS=0x50ab74ed0dac2f82924d6e748ce22ebee339184c \
	FLU_ETHEREUM_START_BLOCK=latest \
	FLU_ETHEREUM_UNISWAP_ANCHORED_VIEW_ADDR=0x6d2299c48a8dd07a872fdd0f8233924872ad1071 \
	FLU_ETHEREUM_HARDHAT_FIX=true

export \
	FLU_ETHEREUM_WORKER_PRIVATE_KEY_USDT="${worker_private_key}" \
	FLU_ETHEREUM_WORKER_PRIVATE_KEY_USDC="${worker_private_key}" \
	FLU_ETHEREUM_WORKER_PRIVATE_KEY_DAI="${worker_private_key}"

export \
	FLU_ETHEREUM_CONTRACT_ADDR_FDAI=0xddd63f96e78dced5b6ef17ee285f2cdbdf8972ab \
	FLU_ETHEREUM_CONTRACT_ADDR_DAI=0x6b175474e89094c44da98b954eedeac495271d0f \
	FLU_ETHEREUM_TOKEN_NAME_FDAI=fDAI \
	FLU_ETHEREUM_TOKEN_NAME_DAI=DAI \
	FLU_ETHEREUM_TOKEN_DECIMALS_DAI=18 \
	FLU_ETHEREUM_WORKER_GAS_LIMIT_DAI=$flu_ethereum_worker_hardhat_gas_limit \
	FLU_ETHEREUM_HARDHAT_FIX_DAI="$FLU_ETHEREUM_HARDHAT_FIX"

export \
	FLU_ETHEREUM_CONTRACT_ADDR_FUSDC=0x737f9dc58538b222a6159efa9cc548ab4b7a3f1e \
	FLU_ETHEREUM_CONTRACT_ADDR_USDC=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48 \
	FLU_ETHEREUM_TOKEN_NAME_FUSDC=fUSDC \
	FLU_ETHEREUM_TOKEN_NAME_USDC=USDC \
	FLU_ETHEREUM_TOKEN_DECIMALS_USDC=6 \
	FLU_ETHEREUM_WORKER_GAS_LIMIT_USDC=$flu_ethereum_worker_hardhat_gas_limit \
	FLU_ETHEREUM_HARDHAT_FIX_USDC="$FLU_ETHEREUM_HARDHAT_FIX"

export \
	FLU_ETHEREUM_CONTRACT_ADDR_FUSDT=0x9391202b846ee3f574e59e4ad58ef6140e9ba4f6 \
	FLU_ETHEREUM_CONTRACT_ADDR_USDT=0xdac17f958d2ee523a2206206994597c13d831ec7 \
	FLU_ETHEREUM_TOKEN_NAME_FUSDT=fUSDT \
	FLU_ETHEREUM_TOKEN_NAME_USDT=USDT \
	FLU_ETHEREUM_TOKEN_DECIMALS_USDT=6 \
	FLU_ETHEREUM_WORKER_GAS_LIMIT_USDT=$flu_ethereum_worker_hardhat_gas_limit \
	FLU_ETHEREUM_HARDHAT_FIX_USDT="$FLU_ETHEREUM_HARDHAT_FIX"

export \
	FLU_ETHEREUM_TOKENS_LIST=$FLU_ETHEREUM_CONTRACT_ADDR_FUSDT:$FLU_ETHEREUM_TOKEN_NAME_USDT:$FLU_ETHEREUM_TOKEN_DECIMALS_USDT,$FLU_ETHEREUM_CONTRACT_ADDR_FUSDC:$FLU_ETHEREUM_TOKEN_NAME_USDC:$FLU_ETHEREUM_TOKEN_DECIMALS_USDT,$FLU_ETHEREUM_CONTRACT_ADDR_FDAI:$FLU_ETHEREUM_TOKEN_NAME_DAI:$FLU_ETHEREUM_TOKEN_DECIMALS_DAI

export \
	FLU_ETHEREUM_FRONTEND_API_URL=http://localhost:8081 \
	FLU_ETHEREUM_FRONTEND_WS_URL=ws://localhost:8081/updates \
	FLU_ETHEREUM_FRONTEND_CHAIN_ID=31337 \
	FLU_ETHEREUM_FRONTEND_TOKEN_FILE=testing-tokens.json \
	FLU_ETHEREUM_FRONTEND_GETH_URL=http://localhost:8545

export \
	FLU_FAUCET_FRONTEND_API_URL=http://localhost:8083 \
	FLU_ETHEREUM_FAUCET_PRIVATE_KEY="$worker_private_key"

docker-compose \
	-f "$automation_dir/docker-compose.rabbitmq.yml" \
	-f "$automation_dir/docker-compose.infrastructure.yml" \
	-f "$automation_dir/docker-compose.database-connectors.yml" \
	-f "$automation_dir/docker-compose.ethereum.yml" \
	-f "$automation_dir/docker-compose.ethereum.fluidity.money.yml" \
	-f "$automation_dir/docker-compose.ethereum-contracts.yml" \
	-f "$automation_dir/docker-compose.ethereum-connectors.yml" \
	-f "$automation_dir/docker-compose.faucet.fluidity.money.yml" \
	-f "$automation_dir/docker-compose.ethereum-worker.yml" \
	$@
