REPO := integration-test-runner-ethereum

GO_FILES := $(shell find . -type f -name '*.go')

test: ${GO_FILES}
	@./run.sh
	@touch test
