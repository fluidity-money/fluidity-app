
include build.mk

AUTOMATION_DIR := automation

.PHONY: docker docker-web docker-compose-build clean semgrep test

all: docker docker-web

build:
	@cd lib && ${MAKE} build-lib
	@cd common && ${MAKE} build-common

docker:
	@${DOCKER_BUILD} \
		${DOCKERFLAGS} \
		-t ${ORG_ROOT}/build-container \
		.

docker-web: docker
	@${DOCKER_BUILD} \
		${DOCKERFLAGS} \
		-t ${ORG_ROOT}/web-container \
		-f Dockerfile.web \
		.

docker-compose-build:
	@./scripts/docker-compose-all.sh build

semgrep:
	@${SEMGREP_ALL} --config .semgrep/golang.yml

test: semgrep
	@${GO_TEST} ./...

lint: semgrep
	@${GO_FMT} ./...
