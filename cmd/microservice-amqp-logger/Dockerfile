
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-amqp-logger

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-amqp-logger.o" \
]
