
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-solana-faucet-send-amounts

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-solana-faucet-send-amounts.o" \
]
