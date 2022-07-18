
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/connector-solana-utility-gauge-postgres

COPY . .

RUN make

ENTRYPOINT [ \
    "wait-for-amqp", \
    "wait-for-database.sh", \
    "./connector-solana-utility-gauge-postgres.o" \
]
