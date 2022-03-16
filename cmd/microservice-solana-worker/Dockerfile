
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-solana-worker

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-solana-worker.o" \
]
