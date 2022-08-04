FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-solana-tribeca-create-proposal

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-solana-tribeca-create-proposal/microservice-solana-tribeca-create-proposal.o .

ENTRYPOINT [ \
    "wait-for-amqp", \
    "./microservice-solana-tribeca-create-proposal.o" \
]

