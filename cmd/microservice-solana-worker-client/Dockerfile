FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-solana-worker-client

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-solana-worker-client/microservice-solana-worker-client.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-solana-worker-client.out" \
]

