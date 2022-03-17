
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/connector-solana-tvl-amqp

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./connector-solana-tvl-amqp.o" \
]
