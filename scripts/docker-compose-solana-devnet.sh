#!/bin/sh

AUTOMATION_DIR=automation

warn() {
	>&2 echo $@
}

[ -z "$FLU_SOLANA_WS_URL" ] && warn "FLU_SOLANA_WS_URL not set!"
[ -z "$FLU_SOLANA_RPC_URL" ] && warn "FLU_SOLANA_RPC_URL not set!"
[ -z "$FLU_SOLANA_TVL_PAYER_PRIKEY" ] && warn "FLU_SOLANA_TVL_PAYER_PRIKEY not set!"

export \
	FLU_SOLANA_PROGRAM_ID=GjRwsHMgCAX2QUrw64tyT9RQhqm28fmntNAjgxoaTztU \
	FLU_SOLANA_FLUID_MINT_PUBKEY=2XGVdHsAiMM9QDM9tV4fwQ2JnyWdSJaiXp2KifLJD1oa \
	FLU_SOLANA_PDA_PUBKEY=89B3rmx8nL7Zc2t6AhFEbC7g2bkzBZTGGdWEibLe3jBW \
	FLU_SOLANA_PRIZE_POOL_UPDATE_TIME=1m \
	FLU_SOLANA_TVL_DATA_PUBKEY=CAKG5gr5ZFGyEXb98pXMqUCdu8gqc5VtXxXkonpcZixW \
	FLU_SOLANA_SOLEND_PROGRAM_ID=ALend7Ketfx5bxh6ghsCDXAoDrhvEmsXT3cynB6aPLgx \
	FLU_SOLANA_OBLIGATION_PUBKEY=HbmfhzwMF71jWxfKoD7sjCLrsVhvt2zEEux8t8oWqFAH \
	FLU_SOLANA_RESERVE_PUBKEY=FNNkz4RCQezSSS71rW2tvqZH1LCkTzaiG7Nd1LeA5x5y \
	FLU_SOLANA_PYTH_PUBKEY=5SSkXsEKQepHHAewytPVwdej4epN1nxgLVM84L4KXgy7 \
	FLU_SOLANA_SWITCHBOARD_PUBKEY=CZx29wKMUxaJDq6aLVQTdViPL754tTR64NAgQBUGxxHb \
	FLU_SOLANA_STARTING_SLOT=latest \
	FLU_SOLANA_TVL_SOLEND_PUBKEY=ALend7Ketfx5bxh6ghsCDXAoDrhvEmsXT3cynB6aPLgx

docker-compose \
	-f "$AUTOMATION_DIR/docker-compose.infrastructure.yml" \
	-f "$AUTOMATION_DIR/docker-compose.database-connectors.yml" \
	-f "$AUTOMATION_DIR/docker-compose.solana.yml" \
	-f "$AUTOMATION_DIR/docker-compose.solana-connectors.yml" \
	$@
