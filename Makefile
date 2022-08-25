
include build.mk

AUTOMATION_DIR := automation

.PHONY: \
	docker \
	docker-web \
	docker-compose-build \
	clean \
	semgrep \
	test \
	docker-test \
	install

all: \
	docker-build \
	docker-build-web \
	docker-runtime \
	docker-runtime-web \
	docker-node

build:
	@cd lib && ${MAKE} build-lib
	@cd common && ${MAKE} build-common

install:
	@cd ${GO_CMD_DIR} && ${MAKE} install

docker-root: go.sum go.mod Dockerfile.build-root
	@${DOCKER_BUILD} \
		${DOCKERFLAGS} \
		-t ${ORG_ROOT}/build-container-root \
		-f Dockerfile.build-root \
		.

	@touch docker-root

docker-root-web: go.sum go.mod Dockerfile.build-root
	@${DOCKER_BUILD} \
		${DOCKERFLAGS} \
		-t ${ORG_ROOT}/build-container-root-web \
		-f Dockerfile.build-root-web \
		.

	@touch docker-root-web

docker-build: docker-root
	@${DOCKER_BUILD} \
		${DOCKERFLAGS} \
		-t ${ORG_ROOT}/build-container \
		-f Dockerfile.build \
		.

	@touch docker-build

docker-runtime: docker-build
	@${DOCKER_BUILD} \
		${DOCKERFLAGS} \
		-t ${ORG_ROOT}/runtime-container \
		-f Dockerfile.runtime \
		.

	@touch docker-runtime

docker-runtime-web:
	@${DOCKER_BUILD} \
		${DOCKERFLAGS} \
		-t ${ORG_ROOT}/runtime-web-container \
		-f Dockerfile.runtime-web \
		.

	@touch docker-runtime-web

docker-build-web: docker-root-web
	@${DOCKER_BUILD} \
		${DOCKERFLAGS} \
		-t ${ORG_ROOT}/build-web-container \
		-f Dockerfile.build-web \
		.

	@touch docker-build-web

docker-node: docker-build
	@${DOCKER_BUILD} \
		${DOCKERFLAGS} \
		-t ${ORG_ROOT}/node-container \
		-f Dockerfile.node \
		.

	@touch docker-node

docker: \
	docker-root \
	docker-root-web \
	docker-build \
	docker-runtime \
	docker-build-web \
	docker-node

docker-test: docker
	@${DOCKER_RUN} -f Dockerfile.test

docker-compose-build:
	@./scripts/docker-compose-all.sh build

semgrep:
	@${SEMGREP_ALL} -q --config .semgrep/golang.yml

test: semgrep
	-@./tests-golang.sh
	-@cd contracts/ethereum && make test
	-@cd contracts/solana && make test

lint: semgrep
	@${GO_FMT} ./...

clean:
	rm -f docker-root docker-root-web
	cd ${GO_CMD_DIR} && ${MAKE} clean
	cd ${WEB_DIR} && ${MAKE} clean
