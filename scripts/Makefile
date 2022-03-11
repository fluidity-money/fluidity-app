
INSTALL_DIR := /usr/local/bin

GO_BUILD := go build

.PHONY: install

all: wait-for-amqp.o wait-for-ws.o

wait-for-amqp.o: $(shell find wait-for-amqp -type f)
	@cd wait-for-amqp && ${GO_BUILD} -o ../wait-for-amqp.o

wait-for-ws.o: $(shell find wait-for-ws -type f)
	@cd wait-for-ws && ${GO_BUILD} -o ../wait-for-ws.o

install: wait-for-amqp.o wait-for-ws.o
	@cp wait-for-database.sh ${INSTALL_DIR}/wait-for-database.sh
	@cp wait-for-amqp.o ${INSTALL_DIR}/wait-for-amqp
	@cp wait-for-ws.o ${INSTALL_DIR}/wait-for-ws
