FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/connector-solana-trf-data-postgres

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/connector-solana-trf-data-postgres/connector-solana-trf-data-postgres.o .

ENTRYPOINT [ \
    "wait-for-amqp", \
    "./connector-solana-trf-data-postgres.o" \
]

