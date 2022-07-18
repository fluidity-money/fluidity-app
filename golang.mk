
# intended to be included by cmd!

include ../../build.mk

SEMGREP_GO_ARGS := --config ../../.semgrep/golang.yml

GO_FILES := $(shell ls -1 *.go)

GO_DIR_LIB := ../../lib

GO_DIR_COMMON := ../../common

${REPO}.o: ${GO_FILES}
	@${GO_BUILD} ${GO_BUILD_EXTRA_ARGS} -o ${REPO}.o

lint: ${GO_FILES}
	@${GO_FMT}
	@touch lint

semgrep: ${GO_FILES}
	@${SEMGREP_ALL} ${SEMGREP_GO_ARGS} ${GO_DIR_LIB} ${GO_DIR_COMMON} .
	@touch semgrep

test: ${GO_FILES} semgrep
	@${GO_TEST} -cover
	@touch test

docker: ${GO_FILES} Dockerfile Makefile
	@${DOCKER_BUILD} -t "${ORG_ROOT}/${REPO}" .
	@touch docker

build: ${REPO}

watch:
	@ls -1 ${GO_FILES} | entr -ns 'clear && make build'

clean:
	@rm -f "${REPO}.o" lint test docker
