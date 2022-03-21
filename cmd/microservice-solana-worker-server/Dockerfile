
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-solana-worker-server

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-solana-worker-server.o" \
]
