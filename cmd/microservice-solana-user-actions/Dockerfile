
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-solana-user-actions

COPY . .

RUN make

ENTRYPOINT [ \
    "wait-for-amqp", \
    "./microservice-solana-user-actions.o" \
]
