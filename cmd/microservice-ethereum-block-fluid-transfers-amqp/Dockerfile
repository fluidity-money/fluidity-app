FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-block-fluid-transfers-amqp

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-ethereum-block-fluid-transfers-amqp/microservice-ethereum-block-fluid-transfers-amqp.o .

ENTRYPOINT [ \
    "wait-for-amqp", \
    "./microservice-ethereum-block-fluid-transfers-amqp.o" \
]

