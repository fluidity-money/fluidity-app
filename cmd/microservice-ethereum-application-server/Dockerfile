FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-application-server

RUN make

ENTRYPOINT [ \
    "wait-for-ws", \
    "wait-for-amqp", \
    "./microservice-ethereum-application-server.o" \
]
