
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

test:
	@cd log && ${GO_TEST}
	@cd postgres && ${GO_TEST}
	@cd types/ethereum && ${GO_TEST}
	@cd types/misc && ${GO_TEST}
	@cd types/token-details && ${GO_TEST}
	@cd types/user-actions && ${GO_TEST}
	@cd util && ${GO_TEST}
	@cd web && ${GO_TEST}