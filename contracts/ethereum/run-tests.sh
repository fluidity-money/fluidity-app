#!/bin/sh

[ -z "$HARDHAT" ] && HARDHAT=hardhat
[ -z "$FORGE" ] && FORGE=forge

if [ -z "$FLU_ETHEREUM_FORKNET_URL_GOERLI" ] || [ -z "FLU_ETHEREUM_FORKNET_URL_MAINNET" ] || [ -z "$FLU_ETHEREUM_FORKNET_URL_ARBITRUM" ]; then
	>&2 echo "FLU_ETHEREUM_FORKNET_URL_GOERLI, FLU_ETHEREUM_FORKNET_URL_MAINNET or FLU_ETHEREUM_FORKNET_URL_ARBITRUM not set!"
	exit 1
fi

failedcode=0
run_test() {
	"$@"
	ret=$?
	if [[ "$ret" -ne 0 ]]; then
		>&2 echo "test command '$@' failed with status $ret!"
		failedcode=$ret
	fi
}

>&2 echo "testing arbitrum..."

FLU_FORKNET_NETWORK=arbitrum run_test $HARDHAT test
run_test $FORGE test

>&2 echo "testing mainnet..."

FLU_FORKNET_NETWORK=mainnet run_test $HARDHAT test

>&2 echo "testing goerli..."

FLU_FORKNET_NETWORK=goerli run_test $HARDHAT test

if [ "$failedcode" -ne 0 ]; then
	>&2 echo "some tests failed!"
	exit $failedcode
fi
