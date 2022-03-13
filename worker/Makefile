
include ./config.mk

REPO := fluidity/worker

REPO_SERVER := ${REPO}/server
REPO_CLIENT := ${REPO}/client

.PHONY: \
	clients \
	servers \
	clean \
	docker \
	ethereum-docker-client \
	ethereum-docker-server \
	solana-docker-server

all: servers clients

clients: ${ETHEREUM_CLIENT}
servers: ${SOLANA_SERVER} ${ETHEREUM_SERVER}

${ETHEREUM_CLIENT}: ${ETHEREUM_CLIENT_FILES}
	@cd ${ETHEREUM_CLIENT_DIR} && ${GO_BUILD} ../../${ETHEREUM_CLIENT}

${ETHEREUM_SERVER}: ${ETHEREUM_SERVER_FILES}
	@cd ${ETHEREUM_SERVER_DIR} && ${GO_BUILD} ../../${ETHEREUM_SERVER}

${SOLANA_SERVER}: ${SOLANA_SERVER_FILES}
	@cd ${SOLANA_SERVER_DIR} && ${GO_BUILD} ../../${SOLANA_SERVER}

docker-base: Dockerfile ${ETHEREUM_CLIENT_FILES} ${ETHEREUM_SERVER_FILES}
	@${DOCKER_BUILD} ${REPO} . --target base
	@touch docker-base

docker-client: docker-base ${SCRIPT_START} ${ETHEREUM_CLIENT_FILES} ${DOCKERFILE_CLIENT}
	@${DOCKER_BUILD} ${REPO_CLIENT} -f ${DOCKERFILE_CLIENT} .
	@touch docker-client

docker-server: docker-base ${SCRIPT_START} ${ETHEREUM_SERVER_FILES} ${SOLANA_SERVER_FILES} ${DOCKERFILE_SERVER}
	${DOCKER_BUILD} ${REPO_SERVER} -f ${DOCKERFILE_SERVER} .
	@touch docker-server

docker: docker-client docker-server

run-docker-ethereum-client: docker-client
	${DOCKER_RUN} \
		-e FLU_ETHEREUM_CONTRACT_ADDR=${FLU_ETHEREUM_CONTRACT_ADDR} \
		-e FLU_WORKER_ETH_PRIVATE_KEY=${FLU_WORKER_ETH_PRIVATE_KEY} \
		-e FLU_ETHEREUM_WS_URL=${FLU_ETHEREUM_WS_URL} \
		-e FLU_QUEUE_ADDR=${FLU_QUEUE_ADDR} \
		-e FLU_ETHEREUM_TOPIC=${FLU_ETHEREUM_TOPIC} \
		-e FLU_PUBLIC_KEY=${FLU_PUBLIC_KEY} \
		${REPO_CLIENT} \
		ethereum-client

run-docker-ethereum-server: docker-server
	${DOCKER_RUN} \
		-e FLU_ETHEREUM_CONTRACT_ADDR=${FLU_ETHEREUM_CONTRACT_ADDR} \
		-e FLU_ETHEREUM_WS_URL=${FLU_ETHEREUM_WS_URL} \
		-e FLU_QUEUE_ADDR=${FLU_QUEUE_ADDR} \
		-e FLU_ETHEREUM_TOPIC=${FLU_ETHEREUM_TOPIC} \
		-e FLU_PRIVATE_KEY=${FLU_PRIVATE_KEY} \
		-e FLU_RANDOM_ORG_API_KEY \
		${REPO_SERVER} \
		ethereum-server

run-docker-solana-server: docker-server
	${DOCKER_RUN} \
		-e FLU_WORKER_ID=${FLU_WORKER_ID} \
		-e FLU_AMQP_QUEUE_ADDR=${FLU_AMQP_QUEUE_ADDR} \
		-e FLU_SOLANA_RESERVE_PUBKEY=${FLU_SOLANA_RESERVE_PUBKEY} \
		-e FLU_SOLANA_FLUID_MINT_PUBKEY=${FLU_SOLANA_FLUID_MINT_PUBKEY} \
		-e FLU_SOLANA_RPC_URL=${FLU_SOLANA_RPC_URL} \
		-e FLU_SOLANA_TVL_PAYER_PUBKEY=${FLU_SOLANA_TVL_PAYER_PUBKEY} \
		-e FLU_SOLANA_PROGRAM_ID=${FLU_SOLANA_PROGRAM_ID} \
		-e FLU_SOLANA_TVL_DATA_PUBKEY=${FLU_SOLANA_TVL_DATA_PUBKEY} \
		-e FLU_SOLANA_SOLEND_PROGRAM_ID=${FLU_SOLANA_SOLEND_PROGRAM_ID} \
		-e FLU_SOLANA_OBLIGATION_PUBKEY=${FLU_SOLANA_OBLIGATION_PUBKEY} \
		-e FLU_SOLANA_PYTH_PUBKEY=${FLU_SOLANA_PYTH_PUBKEY} \
		-e FLU_SOLANA_SWITCHBOARD_PUBKEY=${FLU_SOLANA_SWITCHBOARD_PUBKEY} \
		-e FLU_SOLANA_PAYER_PRIKEY=${FLU_SOLANA_PAYER_PRIKEY} \
		-e FLU_SOLANA_PDA_PUBKEY=${FLU_SOLANA_PDA_PUBKEY} \
		${REPO_SERVER} \
		solana-server

test: ${GO_FILES}
	@FLU_DEBUG=true \
	go test -tags test -coverprofile=coverage.out ./...

test-coverage: test
	@go tool cover -func=coverage.out

build-docker-test: ${GO_FILES}
	@${DOCKER_BUILD} ${REPO}:test .

docker-test: build-docker-test
	@./run-docker-tests.sh 

docker-test-coverage: build-docker-test
	@./run-docker-tests.sh \
		-cover

docker-test-verbose: build-docker-test
	@./run-docker-tests.sh \
		-cover \
		-test.v

clean:
	@rm -rf build/* docker-base docker-server docker-client
