
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/connector-solana-trf-data-postgres

COPY . .

RUN make

ENTRYPOINT [ \
    "wait-for-amqp", \
    "wait-for-database.sh", \
    "./connector-solana-trf-data-postgres.o" \
]
