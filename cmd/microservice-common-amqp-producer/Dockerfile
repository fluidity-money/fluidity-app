FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-common-amqp-producer

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-common-amqp-producer/microservice-common-amqp-producer.o .

ENTRYPOINT [ \
    "wait-for-amqp", \
    "./microservice-common-amqp-producer.o" \
]

