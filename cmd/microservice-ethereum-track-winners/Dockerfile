FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-track-winners

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-ethereum-track-winners/microservice-ethereum-track-winners.o .

ENTRYPOINT [ \
    "wait-for-amqp", \
    "./microservice-ethereum-track-winners.o" \
]

