
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-solana-transactions

COPY . .

RUN make

ENTRYPOINT [ \
    "wait-for-amqp", \
    "./microservice-solana-transactions.o" \
]
