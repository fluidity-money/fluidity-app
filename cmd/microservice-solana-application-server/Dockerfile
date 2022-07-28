FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-solana-application-server

COPY . .
RUN make

ENTRYPOINT [ \
    "wait-for-amqp", \
    "./microservice-solana-application-server.o" \
]
