
REPO := fluidity-solana-tribeca-govern-contracts

ANCHOR_BUILD := anchor build

ANCHOR_TEST := anchor test

ANCHOR_DEPLOY := anchor deploy

SRC_FILES := $(shell find programs Anchor.toml Cargo.*)

.PHONY: build clean test

all: build

deploy:
	@${ANCHOR_DEPLOY}

build: ${SRC_FILES}
	@${ANCHOR_BUILD}

docker: ${SRC_FILES} Dockerfile
	@${DOCKER_BUILD} --target base -t fluidity/${REPO} .
	@touch docker

test-validator: ${SRC_FILES} Dockerfile
	@${DOCKER_BUILD} --target test-validator -t fluidity/${REPO}:validator .
	@touch validator

run-test-validator: test-validator
	@${DOCKER_RUN} -p 8899:8899 -p 8900:8900 -t fluidity/${REPO}:validator

test-anchor: ${SRC_FILES}
	@${ANCHOR_TEST}

test: test-anchor 

clean:
	@rm -rf \
		target \
		docker \

