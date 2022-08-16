FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/connector-solana-amqp

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/connector-solana-amqp/connector-solana-amqp.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./connector-solana-amqp.o" \
]

