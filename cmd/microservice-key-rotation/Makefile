
REPO := microservice-key-rotation

include ../../golang.mk

zip-lambda: ${GO_FILES}
	@GOOS=linux go build -o main ./...
	@zip microservice-key-rotation.zip main
	@rm main
