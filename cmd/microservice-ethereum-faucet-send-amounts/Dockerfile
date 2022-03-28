
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-faucet-send-amounts

COPY . .

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-ethereum-faucet-send-amounts.o" \
]
