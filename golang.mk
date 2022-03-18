
# intended to be included by cmd!

include ../../build.mk

GO_FILES := $(shell ls -1 *.go)

${REPO}.o: ${GO_FILES}
	@${GO_BUILD} ${GO_BUILD_EXTRA_ARGS} -o ${REPO}.o

lint: ${GO_FILES}
	@${GO_FMT}
	@touch lint

test: ${GO_FILES}
	@${GO_TEST}
	@touch test

docker: ${GO_FILES} Dockerfile Makefile
	@${DOCKER_BUILD} -t "${ORG_ROOT}/${REPO}" .
	@touch docker

build: ${REPO}

watch:
	@ls -1 ${GO_FILES} | entr -ns 'clear && make build'

clean:
	@rm -f "${REPO}.o" lint test docker
