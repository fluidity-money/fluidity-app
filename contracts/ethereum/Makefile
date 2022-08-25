
TAG := fluidity/fluidity-eth-contracts

FILES := \
	Dockerfile \
	$(shell find contracts scripts) \
	hardhat.config.ts

DOCKER := docker

.PHONY: clean run test

all: run

docker: ${FILES} hardhat.config.ts test-constants.ts
	@${DOCKER} build \
		--build-arg FLU_ETHEREUM_ORACLE_ADDRESS=$${FLU_ETHEREUM_ORACLE_ADDRESS:-0x16243084bE83bdA3609998e79DD506AB2EF54628} \
		-t ${TAG} .
	@touch docker

run: docker ${FILES}
	@${DOCKER} run \
		-it \
		-p 8545:8545 \
		-e FLU_ETHEREUM_ORACLE_ADDRESS=0x50Ab74ed0dac2f82924D6E748Ce22eBeE339184c \
		-i ${TAG}
test:
	npx hardhat test

clean:
	@rm -f docker artifacts

analysis/docker-slither: ${FILES}
	@${DOCKER} build \
		-t ${TAG}/slither \
		--target slither \
		-f analysis/Dockerfile \
		.
	@touch analysis/docker-slither

run-slither: analysis/docker-slither ${FILES}
	@# slither returns the number of results as its exit status; ignore that
	@${DOCKER} run ${TAG}/slither; true


analysis/docker-semgrep: ${FILES}
	@${DOCKER} build \
		-t ${TAG}/semgrep \
		--target semgrep \
		-f analysis/Dockerfile \
		.
	@touch analysis/docker-semgrep

run-semgrep: analysis/docker-semgrep ${FILES}
	@${DOCKER} run ${TAG}/semgrep


analysis/docker-mythril: ${FILES}
	@${DOCKER} build \
		-t ${TAG}/mythril \
		--target mythril \
		-f analysis/Dockerfile \
		.
	@touch analysis/docker-mythril

run-mythril: analysis/docker-mythril ${FILES}
	@${DOCKER} run ${TAG}/mythril
