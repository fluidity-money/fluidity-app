FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/connector-solana-tvl-amqp

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/connector-solana-tvl-amqp/connector-solana-tvl-amqp.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./connector-solana-tvl-amqp.out" \
]

