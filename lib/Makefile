
include ../build.mk

all: build

DIRS := $(shell \
	find . -name '*.go' -exec dirname '{}' ';' \
		| uniq -u)

build: ${DIRS}
	@echo ${DIRS} \
		| xargs -d' ' -I '{}' sh -xc 'cd $$(readlink -f {}); ${GO_BUILD}'

	@touch build
