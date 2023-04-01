#!/bin/sh

[ -z "$HARDHAT" ] && HARDHAT=hardhat

if [ -z "$FLU_ETHEREUM_FORKNET_URL_GOERLI" ] || [ -z "FLU_ETHEREUM_FORKNET_URL_MAINNET" ] || [ -z "$FLU_ETHEREUM_FORKNET_URL_ARBITRUM" ]; then
	>&2 echo "FLU_ETHEREUM_FORKNET_URL_GOERLI, FLU_ETHEREUM_FORKNET_URL_MAINNET or FLU_ETHEREUM_FORKNET_URL_ARBITRUM not set!"
	exit 1
fi
#
#  >&2 echo "testing mainnet..."
#
#  FLU_FORKNET_NETWORK=mainnet $HARDHAT test

>&2 echo "testing arbitrum..."

FLU_FORKNET_NETWORK=arbitrum $HARDHAT test
#
#  >&2 echo "testing goerli..."
#
#  FLU_FORKNET_NETWORK=goerli $HARDHAT test
