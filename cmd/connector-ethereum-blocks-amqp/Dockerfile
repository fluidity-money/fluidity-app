
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/connector-ethereum-blocks-amqp

RUN make

ENTRYPOINT [ \
	"wait-for-ws", \
	"wait-for-amqp", \
	"./connector-ethereum-blocks-amqp.o" \
]
