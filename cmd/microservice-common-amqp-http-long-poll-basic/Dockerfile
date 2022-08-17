FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-common-amqp-http-long-poll-basic

COPY . .

RUN make

FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-common-amqp-http-long-poll-basic/microservice-common-amqp-http-long-poll-basic.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-common-amqp-http-long-poll-basic.out" \
]
