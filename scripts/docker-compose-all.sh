#!/bin/sh -e

automation_dir="$(dirname "$0")/../automation"

export \
	FLU_ETHEREUM_FRONTEND_API_URL=http://localhost:8081 \
	FLU_ETHEREUM_FRONTEND_WS_URL=ws://localhost:8081/updates \
	FLU_ETHEREUM_FRONTEND_CHAIN_ID=31337 \
	FLU_ETHEREUM_FRONTEND_TOKEN_FILE=testing-tokens.json \
	FLU_ETHEREUM_FRONTEND_GETH_URL=http://localhost:8545

export \
	FLU_SOLANA_FRONTEND_API_URL=http://localhost:8084 \
	FLU_SOLANA_FRONTEND_WS_URL=ws://localhost:8084/updates

docker-compose \
	-f "$automation_dir/docker-compose.rabbitmq.yml" \
	-f "$automation_dir/docker-compose.infrastructure.yml" \
	-f "$automation_dir/docker-compose.volumes.yml" \
	-f "$automation_dir/docker-compose.database-connectors.yml" \
	-f "$automation_dir/docker-compose.ethereum.yml" \
	-f "$automation_dir/docker-compose.ethereum.fluidity.money.yml" \
	-f "$automation_dir/docker-compose.ethereum-contracts.yml" \
	-f "$automation_dir/docker-compose.ethereum-connectors.yml" \
	-f "$automation_dir/docker-compose.faucet.fluidity.money.yml" \
	-f "$automation_dir/docker-compose.solana.yml" \
	-f "$automation_dir/docker-compose.solana-transactions-user-actions.yml" \
	-f "$automation_dir/docker-compose.solana-connectors.yml" \
	-f "$automation_dir/docker-compose.solana.fluidity.money.yml" \
	-f "$automation_dir/docker-compose.solana-worker.yml" \
	$@
