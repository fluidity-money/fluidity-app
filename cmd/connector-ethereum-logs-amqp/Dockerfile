
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/connector-ethereum-logs-amqp

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"wait-for-ws", \
	"./connector-ethereum-logs-amqp.o" \
]
