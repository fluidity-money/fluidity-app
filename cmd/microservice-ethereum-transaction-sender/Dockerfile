FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-transaction-sender

RUN make

ENTRYPOINT [ \
    "wait-for-ws", \
    "wait-for-amqp", \
    "./microservice-ethereum-transaction-sender.o" \
]
