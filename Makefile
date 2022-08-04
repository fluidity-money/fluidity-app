
include build.mk

AUTOMATION_DIR := automation

.PHONY: \
	docker \
	docker-web \
	docker-compose-build \
	clean \
	semgrep \
	test \
	docker-test

all: docker-build docker-runtime docker-web

build:
	@cd lib && ${MAKE} build-lib
	@cd common && ${MAKE} build-common

docker-root: go.sum go.mod Dockerfile.build-root
	@${DOCKER_BUILD} \
		${DOCKERFLAGS} \
		-t ${ORG_ROOT}/build-container-root \
		-f Dockerfile.build-root \
		.

	@touch docker-root

docker-build: docker-root
	@${DOCKER_BUILD} \
		${DOCKERFLAGS} \
		-t ${ORG_ROOT}/build-container \
		-f Dockerfile.build \
		.

docker-runtime: docker-build
	@${DOCKER_BUILD} \
		${DOCKERFLAGS} \
		-t ${ORG_ROOT}/runtime-container \
		-f Dockerfile.runtime \
		.

docker-web: docker-build
	@${DOCKER_BUILD} \
		${DOCKERFLAGS} \
		-t ${ORG_ROOT}/web-container \
		-f Dockerfile.web \
		.

docker-test: docker
	@${DOCKER_RUN} -f Dockerfile.test

docker-compose-build:
	@./scripts/docker-compose-all.sh build

semgrep:
	@${SEMGREP_ALL} -q --config .semgrep/golang.yml

test: semgrep
	@./run-tests.sh

lint: semgrep
	@${GO_FMT} ./...
