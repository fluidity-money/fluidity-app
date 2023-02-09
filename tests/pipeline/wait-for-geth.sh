#!/bin/sh

arguments="$@"

test_geth() {
	url="$1"
	counter=0

	while ! curl --silent --show-error -H "Content-Type: application/json" -X POST --data '{"method":"eth_chainId","params":[],"id":0,"jsonrpc":"2.0"}' "$url" 2>&1 >/dev/null; do
		if [ "$counter" -gt 50 ]; then
			err "50 connection attempts exceeded!"
		fi

		sleep 1
		counter=$((counter+1))
	done
}

[ -z "$FLU_ETHEREUM_HTTP_URL" ] || test_geth "$FLU_ETHEREUM_HTTP_URL"

exec $arguments
