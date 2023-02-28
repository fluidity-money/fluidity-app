#!/bin/sh

# we start the server on port 8544 initially, and then create a redirect from 8545 once our contracts are set up
# this should probably only be run in docker unless you really know what you're doing

if [ "$FLU_ETHEREUM_FORKING" = "true" ]; then
	anvil \
		--host 0.0.0.0 \
		--port 8544 \
		--mnemonic "$FLU_ETHEREUM_SEED_PHRASE" \
		--fork-url="$FLU_ETHEREUM_FORK_URL" \
		--fork-block-number="$FLU_ETHEREUM_FORK_BLOCK_NUMBER" &
	anvilpid=$!
else
	anvil --host 0.0.0.0 --port 8544 --mnemonic "$FLU_ETHEREUM_SEED_PHRASE" &
	anvilpid=$!
fi

echo "NOW ABOUT TO CHECK IF ANVIL IS RUNNING"

for i in `seq 1 10`; do
	if cast chain-id --rpc-url=http://localhost:8544; then
		echo "forknet started, running script..."
		break
	elif [ $i -eq 10 ]; then
		echo "server not found after 10 seconds!"
		exit 1
	else
		echo "server not started, waiting..."
		sleep 1
	fi
done

forge script --rpc-url=http://localhost:8544 --broadcast "$FLU_FORGE_SCRIPT"

socat tcp-listen:8545,reuseaddr,fork tcp:localhost:8544 &

wait $anvilpid
