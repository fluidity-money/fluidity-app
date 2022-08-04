FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/connector-common-prize-pool-postgres

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/connector-common-prize-pool-postgres/connector-common-prize-pool-postgres.o .

ENTRYPOINT [ \
    "wait-for-amqp", \
    "./connector-common-prize-pool-postgres.o" \
]

