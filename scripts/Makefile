
INSTALL_DIR := /usr/local/bin

wait-for-amqp.o: $(shell find wait-for-amqp -type f)
	@cd wait-for-amqp && go build -o ../wait-for-amqp.o

install: wait-for-amqp.o
	@cp wait-for-amqp.o ${INSTALL_DIR}/wait-for-amqp
