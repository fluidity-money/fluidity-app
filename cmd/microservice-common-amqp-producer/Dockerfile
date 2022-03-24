
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-common-amqp-producer

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-common-amqp-producer.o" \
]
