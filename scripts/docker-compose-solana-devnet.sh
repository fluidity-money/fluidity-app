#!/bin/sh

AUTOMATION_DIR=automation

warn() {
	>&2 echo $@
}

[ -z "$FLU_SOLANA_WS_URL" ] && warn "FLU_SOLANA_WS_URL not set!"
[ -z "$FLU_SOLANA_RPC_URL" ] && warn "FLU_SOLANA_RPC_URL not set!"
[ -z "$FLU_SOLANA_TVL_PAYER_PRIKEY" ] && warn "FLU_SOLANA_TVL_PAYER_PRIKEY not set!"

export \
	FLU_SOLANA_PROGRAM_ID=HXCKzsLf5ohVEYo5shk7MjhbqeUemwikBj4667aPhmK9 \
	FLU_SOLANA_PRIZE_POOL_UPDATE_TIME=1m \
	FLU_SOLANA_TVL_DATA_PUBKEY=H2foXjvceQu7dPE8v8f3uMz83Cs3FJeYxQy65Ybgzot4 \
	FLU_SOLANA_SOLEND_PROGRAM_ID=ALend7Ketfx5bxh6ghsCDXAoDrhvEmsXT3cynB6aPLgx \
	FLU_SOLANA_STARTING_SLOT=latest \
	FLU_SOLANA_TVL_SOLEND_PUBKEY=ALend7Ketfx5bxh6ghsCDXAoDrhvEmsXT3cynB6aPLgx

export \
	FLU_SOLANA_FLUID_MINT_PUBKEY_USDC=5jsh1taLrqNgiV3UN8diDxZAXRC7T4iALfNWwThBksoj \
	FLU_SOLANA_PDA_PUBKEY_USDC=F3bNiT1rmu1Aqt6o43miDuXh9v7M6BAqysS96Tik2NKe \
	FLU_SOLANA_OBLIGATION_PUBKEY_USDC=AzC4PyevxfhrRcY4x7Xm94PQyf9nfjcheLsSiE53Rcy \
	FLU_SOLANA_RESERVE_PUBKEY_USDC=FNNkz4RCQezSSS71rW2tvqZH1LCkTzaiG7Nd1LeA5x5y \
	FLU_SOLANA_PYTH_PUBKEY_USDC=5SSkXsEKQepHHAewytPVwdej4epN1nxgLVM84L4KXgy7 \
	FLU_SOLANA_SWITCHBOARD_PUBKEY_USDC=CZx29wKMUxaJDq6aLVQTdViPL754tTR64NAgQBUGxxHb \
	FLU_SOLANA_TOKEN_SHORT_NAME_USDC=USDC \
	FLU_SOLANA_TOKEN_DECIMALS_USDC=6

export \
	FLU_SOLANA_FLUID_MINT_PUBKEY_USDT=Dx8dUQ8p8zbQwv7jvXqaEdYWcK7AroNifHbcAC7YYRjg \
	FLU_SOLANA_PDA_PUBKEY_USDT=CsCAmWNMWXemyFL3QBoR3v8BU5nwGEvG5qcAKVFxzAjY \
	FLU_SOLANA_OBLIGATION_PUBKEY_USDT=EHxPXaojrnNGmUDBqz8fCbcdgYswn9MpNHtKMR6WkY7z \
	FLU_SOLANA_RESERVE_PUBKEY_USDT=ERm3jhg8J94hxr7KmhkRvnuYbKZgNFEL4hXzBMeb1rQ8 \
	FLU_SOLANA_PYTH_PUBKEY_USDT=38xoQ4oeJCBrcVvca2cGk7iV1dAfrmTR1kmhSCJQ8Jto \
	FLU_SOLANA_SWITCHBOARD_PUBKEY_USDT=5mp8kbkTYwWWCsKSte8rURjTuyinsqBpJ9xAQsewPDD \
	FLU_SOLANA_TOKEN_SHORT_NAME_USDT=USDT \
	FLU_SOLANA_TOKEN_DECIMALS_USDT=6

docker-compose \
	-f "$AUTOMATION_DIR/docker-compose.infrastructure.yml" \
	-f "$AUTOMATION_DIR/docker-compose.database-connectors.yml" \
	-f "$AUTOMATION_DIR/docker-compose.solana.yml" \
	-f "$AUTOMATION_DIR/docker-compose.solana.fluidity.money.yml" \
	-f "$AUTOMATION_DIR/docker-compose.solana-worker.yml" \
	-f "$AUTOMATION_DIR/docker-compose.solana-connectors.yml" \
	$@
