
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/connector-solana-tribeca-timescale

COPY . .

RUN make

ENTRYPOINT [ \
    "wait-for-amqp", \
    "wait-for-database.sh", \
    "./connector-solana-tribeca-timescale.o" \
]
