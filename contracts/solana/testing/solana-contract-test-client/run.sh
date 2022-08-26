#!/bin/sh -e

e2e_testing_dir="$(dirname "$0")"

cd $e2e_testing_dir

export \
	FLU_FLUID_MINT=2hFRoLHprEn6wEiJm2TiGbddNEWx91JaP6KYjyLzEVJF \
	FLU_PROGRAM_ID=B6xiDeQ9gNHdM4XG1VqHwyFR3AqUukKAzzhDFJirkgqP \
	FLU_TOKEN_MINT=zVzi5VAf4qMEwzv7NXECVx5v2pQ7xnqVVjCXZwS9XzA \
	FLU_TOKEN_NAME=USDC \
	FLU_SOLANA_ACCOUNTS=accounts.json \
	FLU_SOLANA_NODE_ADDRESS=https://api.devnet.solana.com \
	FLU_SLND_COMMON=devnet.json

cargo test
