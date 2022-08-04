FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/connector-ethereum-block-headers-amqp

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/connector-ethereum-block-headers-amqp/connector-ethereum-block-headers-amqp.o .

ENTRYPOINT [ \
    "wait-for-amqp", \
    "./connector-ethereum-block-headers-amqp.o" \
]

