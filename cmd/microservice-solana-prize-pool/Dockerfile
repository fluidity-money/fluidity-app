FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-solana-prize-pool

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-solana-prize-pool/microservice-solana-prize-pool.o .

ENTRYPOINT [ \
    "wait-for-amqp", \
    "./microservice-solana-prize-pool.o" \
]

