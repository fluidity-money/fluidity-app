FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-solana-faucet-send-amounts

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-solana-faucet-send-amounts/microservice-solana-faucet-send-amounts.o .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-solana-faucet-send-amounts.o" \
]

