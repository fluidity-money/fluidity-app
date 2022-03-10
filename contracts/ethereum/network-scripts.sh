#!/bin/sh -e

err() {
	>&2 echo $@
	exit 1
}

case "$1" in
	deploy-hardhat)
		npx hardhat compile
		npx hardhat deploy-forknet
	;;

	ganache)
		err "ganache isn't needed anymore - use the hardhat forknet!"
	;;

	make-txn)
		npx hardhat run scripts/usdt-to-fluid.ts --network local
	;;

	mine)
		npx hardhat run scripts/mine.ts --network local
	;;

	transfer)
		npx hardhat run scripts/transfer.ts --network local
	;;

	*)
		err "(deploy-hardhat|ganache|make-txn|mine|transfer) accepted"
	;;
esac
