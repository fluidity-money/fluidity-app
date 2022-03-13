#!/bin/sh -e

err() {
	>&2 echo "Bad invocation! $@"
	exit 1
}

build_dir="build"

command="$1"

[ "$#" -gt 0 ] && shift

case $command in
	ethereum-client)
		./$build_dir/ethereum-client $@
	;;

	ethereum-server)
		./$build_dir/ethereum-server $@
	;;

	solana-server)
		./$build_dir/solana-server $@
	;;

	*)
		err "(ethereum-client|ethereum-server|solana-server) expected!"
	;;
esac
