FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-solana-transactions

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-solana-transactions/microservice-solana-transactions.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-solana-transactions.o" \
]

