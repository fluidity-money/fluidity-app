FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-solana-tribeca-executor

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-solana-tribeca-executor/microservice-solana-tribeca-executor.o .

ENTRYPOINT [ \
    "wait-for-amqp", \
    "./microservice-solana-tribeca-executor.o" \
]

