
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/connector-ethlogs-amqp

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./connector-ethlogs-amqp.o" \
]
