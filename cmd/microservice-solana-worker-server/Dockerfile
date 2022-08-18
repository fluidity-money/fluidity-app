FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-solana-worker-server

COPY . .

RUN make

FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-solana-worker-server/microservice-solana-worker-server.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-solana-worker-server.out" \
]

