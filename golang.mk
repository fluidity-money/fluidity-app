
# intended to be included by cmd!

include ../../build.mk

GO_FILES := $(shell ls -1 *.go)

${REPO}: ${GO_FILES}
	@${GO_BUILD} -o ${REPO}

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

clean:
	@rm -f ${REPO} lint test docker
