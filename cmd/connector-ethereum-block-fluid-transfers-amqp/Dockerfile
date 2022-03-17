
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/connector-ethereum-block-fluid-transfers-amqp

RUN make

ENTRYPOINT [ \
    "wait-for-ws", \
    "wait-for-amqp", \
    "./connector-ethereum-block-fluid-transactions-amqp.o" \
]
