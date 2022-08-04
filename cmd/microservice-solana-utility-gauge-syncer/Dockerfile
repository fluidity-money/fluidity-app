FROM fluidity/node-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-solana-utility-gauge-syncer

COPY . .
RUN make

ENTRYPOINT [ \
    "wait-for-amqp", \
    "./start.sh" \
]

