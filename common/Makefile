
include ../build.mk

all: build-common

FILES := $(shell find . -name '*.go')

build-common: ${FILES}
	@echo ${FILES} \
		| xargs -d' ' -I '{}' dirname {} \
		| uniq -u \
		| xargs -I '{}' sh -c 'cd {} && ${GO_BUILD}'

	@touch build-common

build: build-common
