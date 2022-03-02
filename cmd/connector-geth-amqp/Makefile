
REPO := connector-geth-amqp

SRC_FILES := $(shell find src)
LIB_FILES := $(shell find lib)

FILES := ${SRC_FILES} ${LIB_FILES}

GO := go
GO_FMT := ${GO} fmt

DOCKER := docker

.PHONY: build

${REPO}: ${FILES}
	@cd src && ${GO} build -o ../${REPO}

build: ${REPO}

lint: ${FILES}
	@cd src && ${GO_FMT}
	@cd lib && ${GO_FMT}
	@touch lint

test: ${FILES}
	@cd src && ${GO} test -cover
	@touch test

docker: ${FILES}
	@${DOCKER} build -t fluidity/${REPO} .
	@touch docker

clean:
	@rm -f ${REPO} lint test docker
