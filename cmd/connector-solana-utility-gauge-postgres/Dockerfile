FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/connector-solana-utility-gauge-postgres

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/connector-solana-utility-gauge-postgres/connector-solana-utility-gauge-postgres.o .

ENTRYPOINT [ \
    "wait-for-amqp", \
    "./connector-solana-utility-gauge-postgres.o" \
]

