
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-track-winners

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-ethereum-track-winners.o" \
]
