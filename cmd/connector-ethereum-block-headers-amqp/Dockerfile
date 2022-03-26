
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/connector-ethereum-block-headers-amqp

RUN make

ENTRYPOINT [ \
    "wait-for-ws", \
    "wait-for-amqp", \
    "./connector-ethereum-block-headers-amqp.o" \
]
