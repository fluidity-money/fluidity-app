
# Fluidity Go Dockerfile

Sets up a container called `fluidity/go-docker` which contains repos located
in /usr/src/ contained as submodules in this directory.

Also installs Ethereum devtools available at
https://github.com/ethereum/go-ethereum.git.

## Building

	make docker
