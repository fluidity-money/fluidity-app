
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-user-actions

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-ethereum-user-actions.o" \
]
