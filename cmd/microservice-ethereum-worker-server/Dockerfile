FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-worker-server

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-ethereum-worker-server/microservice-ethereum-worker-server.o .

ENTRYPOINT [ \
    "wait-for-amqp", \
    "./microservice-ethereum-worker-server.o" \
]

