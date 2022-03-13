
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-solana-prize-pool

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-solana-prize-pool.o" \
]
