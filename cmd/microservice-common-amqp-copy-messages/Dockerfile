FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-common-amqp-copy-messages

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-common-amqp-copy-messages/microservice-common-amqp-copy-messages.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-common-amqp-copy-messages.out" \
]

