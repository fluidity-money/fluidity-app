
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-common-amqp-logger

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-common-amqp-logger.o" \
]
