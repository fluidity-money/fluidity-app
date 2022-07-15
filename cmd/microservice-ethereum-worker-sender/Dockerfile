FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-worker-sender

COPY . .

RUN make

ENTRYPOINT [ \
    "wait-for-ws", \
    "wait-for-amqp", \
    "./microservice-ethereum-worker-sender.o" \
]
