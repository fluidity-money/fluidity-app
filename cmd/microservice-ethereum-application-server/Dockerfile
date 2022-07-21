FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-application-server

COPY . .

RUN make

ENTRYPOINT [ \
    "wait-for-amqp", \
    "./microservice-ethereum-application-server.o" \
]
