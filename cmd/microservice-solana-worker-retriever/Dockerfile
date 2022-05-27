
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-solana-worker-retriever

COPY . .

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-solana-worker-retriever.o" \
]
