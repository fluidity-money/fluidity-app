FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-solana-utility-gauge-syncer

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-solana-utility-gauge-syncer/microservice-solana-utility-gauge-syncer.o .

ENTRYPOINT [ \
    "wait-for-amqp", \
    "./microservice-solana-utility-gauge-syncer.o" \
]

