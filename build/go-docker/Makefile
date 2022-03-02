
CONTAINER_NAME := fluidity/go-docker

DOCKER_BUILD := docker build

FILES := $(shell find . -type d ! -path '.git/*')

.PHONY: install clean

all: docker

update:
	#@git clone https://github.com/fluidity-money/microservice-lib
	#@git clone https://github.com/fluidity-money/connector-geth-amqp
	#@git clone https://github.com/fluidity-money/fluidity-worker
	#@git clone https://github.com/fluidity-money/microservice-solana-prize-pool
	@touch update

wait-for-ws: test-ws/main.go
	@cd test-ws && go build -o ../wait-for-ws

wait-for-amqp: test-amqp/main.go
	@cd test-amqp && go build -o ../wait-for-amqp

wait-for-mqtt: test-mqtt/main.go
	@cd test-mqtt && go build -o ../wait-for-mqtt

install: ${FILES} wait-for-amqp wait-for-ws wait-for-mqtt profile gitconfig update
	@find . -type d \
		! -path . \
		! -path test-amqp \
		! -path test-mqtt \
		-exec cp -r "{}" "/usr/local/src/{}" \;

	@cp \
		wait-for-database.sh \
		wait-for-amqp \
		wait-for-ws \
		wait-for-mqtt \
		/usr/bin

	@>&2 echo "Copying gitconfig to $$HOME/.gitconfig"
	@cp gitconfig $$HOME/.gitconfig

	@>&2 echo "Copying profile to /etc/profile"
	@cp profile /etc/profile

docker: ${FILES} Dockerfile Makefile profile gitconfig update
	@${DOCKER_BUILD} -t ${CONTAINER_NAME} .
	@touch docker

clean:
	@rm -rf \
		docker \
		wait-for-amqp \
		wait-for-ws \
		wait-for-mqtt \
		microservice-lib \
		connector-geth-amqp \
		microservice-solana-prize-pool \
		fluidity-worker
