
include ../build.mk

all: build-lib

FILES := $(shell find . -name '*.go')

build-lib: ${FILES}
	@echo ${FILES} \
		| xargs -d' ' -I '{}' dirname {} \
		| uniq -u \
		| xargs -I '{}' sh -c 'cd {} && ${GO_BUILD}'

	@touch build-lib

build: build-lib
