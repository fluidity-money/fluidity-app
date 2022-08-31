#!/bin/sh

SOTERIA_IMG="greencorelab/soteria:latest"

CARGO_PATH="/root/.cargo/bin"
SOLANA_PATH="/root/.local/share/solana/install/active_release/bin"
SOTERIA_PATH="/soteria-linux-develop/bin"
EXPORT_CMD="export PATH=$CARGO_PATH:\$PATH"

BUILD_BPF_CMD="cargo build-bpf"

SOTERIA_CMD="soteria -analyzeAll ."

RUN_COMMAND="$EXPORT_CMD && $BUILD_BPF_CMD && $SOTERIA_CMD"

docker run -v $PWD/:/workspace -it $SOTERIA_IMG /bin/bash -c "$RUN_COMMAND"
