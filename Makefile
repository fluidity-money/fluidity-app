
include build.mk

AUTOMATION_DIR := automation

.PHONY: docker docker-web docker-compose-build

all: docker docker-web

docker:
	@${DOCKER_BUILD} -t ${ORG_ROOT}/build-container .

docker-web: docker
	@${DOCKER_BUILD} \
		-t ${ORG_ROOT}/web-container \
		-f Dockerfile.web \
		.

docker-compose-build:
	@./scripts/docker-compose-all.sh build
