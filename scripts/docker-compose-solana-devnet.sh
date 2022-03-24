#!/bin/sh

automation_dir=automation

export \
	FLU_AMQP_QUEUE_ADDR=amqp://fluidity:fluidity@rabbitmq \
	FLU_UNIVERSE=testing

export \
	FLU_SOLANA_FRONTEND_API_URL=http://localhost:8084 \
	FLU_SOLANA_FRONTEND_WS_URL=ws://localhost:8084/updates

export \
	FLU_SOLANA_PROGRAM_ID=GjRwsHMgCAX2QUrw64tyT9RQhqm28fmntNAjgxoaTztU \
	FLU_SOLANA_PRIZE_POOL_UPDATE_TIME=1m \
	FLU_SOLANA_TVL_DATA_PUBKEY=CAKG5gr5ZFGyEXb98pXMqUCdu8gqc5VtXxXkonpcZixW \
	FLU_SOLANA_SOLEND_PROGRAM_ID=ALend7Ketfx5bxh6ghsCDXAoDrhvEmsXT3cynB6aPLgx \
	FLU_SOLANA_STARTING_SLOT=latest \
	FLU_SOLANA_TVL_SOLEND_PUBKEY=ALend7Ketfx5bxh6ghsCDXAoDrhvEmsXT3cynB6aPLgx

export \
	FLU_SOLANA_SABER_RPC_URL=https://saberqltest.aleph.cloud \
	FLU_SOLANA_SABER_SWAP_PROGRAM_ID=SSwpkEEcbUqx4vtoEByFjSkhKdCT862DNVb52nZg1UZ \
	FLU_SOLANA_SOL_PYTH_PUBKEY=J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix

export \
	FLU_SOLANA_BASE_MINT_USDC=zVzi5VAf4qMEwzv7NXECVx5v2pQ7xnqVVjCXZwS9XzA \
	FLU_SOLANA_FLUID_MINT_PUBKEY_USDC=2XGVdHsAiMM9QDM9tV4fwQ2JnyWdSJaiXp2KifLJD1oa \
	FLU_SOLANA_PDA_PUBKEY_USDC=89B3rmx8nL7Zc2t6AhFEbC7g2bkzBZTGGdWEibLe3jBW \
	FLU_SOLANA_OBLIGATION_PUBKEY_USDC=HbmfhzwMF71jWxfKoD7sjCLrsVhvt2zEEux8t8oWqFAH \
	FLU_SOLANA_RESERVE_PUBKEY_USDC=FNNkz4RCQezSSS71rW2tvqZH1LCkTzaiG7Nd1LeA5x5y \
	FLU_SOLANA_PYTH_PUBKEY_USDC=5SSkXsEKQepHHAewytPVwdej4epN1nxgLVM84L4KXgy7 \
	FLU_SOLANA_SWITCHBOARD_PUBKEY_USDC=CZx29wKMUxaJDq6aLVQTdViPL754tTR64NAgQBUGxxHb \
	FLU_SOLANA_DATA_ACCOUNT_USDC=7ZaehFMj49vvLQbRpWhfv1evF1c8jMcuLkXy4YFAfb52 \
	FLU_SOLANA_TOKEN_SHORT_NAME_USDC=USDC \
	FLU_SOLANA_TOKEN_DECIMALS_USDC=6

export \
	FLU_SOLANA_BASE_MINT_USDT=Bp2nLuamFZndE7gztA1iPsNVhdJeg9xfKdq7KmvjpGoP \
	FLU_SOLANA_FLUID_MINT_PUBKEY_USDT= \
	FLU_SOLANA_PDA_PUBKEY_USDT= \
	FLU_SOLANA_OBLIGATION_PUBKEY_USDT= \
	FLU_SOLANA_RESERVE_PUBKEY_USDT=ERm3jhg8J94hxr7KmhkRvnuYbKZgNFEL4hXzBMeb1rQ8 \
	FLU_SOLANA_PYTH_PUBKEY_USDT=38xoQ4oeJCBrcVvca2cGk7iV1dAfrmTR1kmhSCJQ8Jto \
	FLU_SOLANA_SWITCHBOARD_PUBKEY_USDC=5mp8kbkTYwWWCsKSte8rURjTuyinsqBpJ9xAQsewPDD \
	FLU_SOLANA_DATA_ACCOUNT_USDT= \
	FLU_SOLANA_TOKEN_SHORT_NAME_USDC=USDT \
	FLU_SOLANA_TOKEN_DECIMALS_USDC=6

export FLU_SOLANA_DEBUG_FAKE_PAYOUTS=true

docker-compose \
	-f "$automation_dir/docker-compose.rabbitmq.yml" \
	-f "$automation_dir/docker-compose.infrastructure.yml" \
	-f "$automation_dir/docker-compose.database-connectors.yml" \
	-f "$automation_dir/docker-compose.solana.yml" \
	-f "$automation_dir/docker-compose.solana-transactions-user-actions.yml" \
	-f "$automation_dir/docker-compose.solana-connectors.yml" \
	-f "$automation_dir/docker-compose.solana.fluidity.money.yml" \
	-f "$automation_dir/docker-compose.solana-worker.yml" \
	$@

