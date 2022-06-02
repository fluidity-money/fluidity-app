FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-unspool-rewards

COPY . .

RUN make

ENTRYPOINT [ \
    "wait-for-amqp", \
    "./microservice-ethereum-unspool-rewards.o" \
]
