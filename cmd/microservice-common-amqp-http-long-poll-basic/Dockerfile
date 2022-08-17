FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-common-amqp-http-long-poll

COPY . .

RUN make

FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-common-amqp-http-long-poll/microservice-common-amqp-http-long-poll.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-common-amqp-http-long-poll.out" \
]
