FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-solana-worker-retriever

COPY . .

RUN make

FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-solana-worker-retriever/microservice-solana-worker-retriever.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-solana-worker-retriever.out" \
]
