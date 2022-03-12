#!/bin/sh

AUTOMATION_DIR=automation

export \
	FLU_ETHEREUM_WS_URL=ws://contracts-ethereum:8545 \
	FLU_ETHEREUM_HTTP_URL=http://contracts-ethereum:8545 \
	FLU_ETHEREUM_ORACLE_ADDRESS=0x50Ab74ed0dac2f82924D6E748Ce22eBeE339184c \
	FLU_ETHEREUM_START_BLOCK=latest \
	FLU_ETHEREUM_UNISWAP_ANCHORED_VIEW_ADDR=0x6D2299C48a8dD07a872FDd0F8233924872Ad1071

export \
	FLU_ETHEREUM_CONTRACT_ADDR_DAI=0xdDd63f96e78dCed5B6ef17Ee285F2cDbDF8972Ab \
	FLU_ETHEREUM_TOKEN_NAME_DAI=DAI \
	FLU_ETHEREUM_TOKEN_DECIMALS_DAI=18 \

export \
	FLU_ETHEREUM_CONTRACT_ADDR_USDC=0x737f9DC58538B222a6159EfA9CC548AB4b7a3F1e \
	FLU_ETHEREUM_TOKEN_NAME_USDC=USDC \
	FLU_ETHEREUM_TOKEN_DECIMALS_USDC=6 \

export \
	FLU_ETHEREUM_CONTRACT_ADDR_USDT=0x9391202B846ee3f574e59E4AD58ef6140E9ba4F6 \
	FLU_ETHEREUM_TOKEN_NAME_USDT=USDT \
	FLU_ETHEREUM_TOKEN_DECIMALS_USDT=6

export \
	FLU_ETHEREUM_TOKENS_LIST=$FLU_ETHEREUM_CONTRACT_ADDR_USDT:$FLU_ETHEREUM_TOKEN_NAME_USDT:$FLU_ETHEREUM_TOKEN_DECIMALS_USDT,$FLU_ETHEREUM_CONTRACT_ADDR_USDC:$FLU_ETHEREUM_TOKEN_NAME_USDC:$FLU_ETHEREUM_TOKEN_DECIMALS_USDT,$FLU_ETHEREUM_CONTRACT_ADDR_DAI:$FLU_ETHEREUM_TOKEN_NAME_DAI:$FLU_ETHEREUM_TOKEN_DECIMALS_DAI

docker-compose \
	-f "$AUTOMATION_DIR/docker-compose.ethereum.yml" \
	-f "$AUTOMATION_DIR/docker-compose.infrastructure.yml" \
	-f "$AUTOMATION_DIR/docker-compose.ethereum.fluidity.money.yml" \
	$@
