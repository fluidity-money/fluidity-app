
INSTALL_DIR := /usr/local/bin

GO_BUILD := go build

.PHONY: install

all: wait-for-amqp.out wait-for-ws.out

wait-for-amqp.out: $(shell find wait-for-amqp -type f)
	@cd wait-for-amqp && ${GO_BUILD} -o ../wait-for-amqp.out

wait-for-ws.out: $(shell find wait-for-ws -type f)
	@cd wait-for-ws && ${GO_BUILD} -o ../wait-for-ws.out

install: wait-for-amqp.out wait-for-ws.out
	@cp wait-for-database.sh ${INSTALL_DIR}/wait-for-database.sh
	@cp wait-for-amqp.out ${INSTALL_DIR}/wait-for-amqp
	@cp wait-for-ws.out ${INSTALL_DIR}/wait-for-ws
