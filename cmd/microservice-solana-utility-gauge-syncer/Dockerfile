
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-solana-utility-gauge-syncer

COPY . .

RUN make build

ENTRYPOINT [ \
    "wait-for-amqp", \
    "wait-for-db", \
    "./start.sh" \
]
