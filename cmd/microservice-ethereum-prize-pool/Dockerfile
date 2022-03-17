
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-prize-pool

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-ethereum-prize-pool.o" \
]
