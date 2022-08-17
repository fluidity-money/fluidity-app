FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-common-rabbitmq-backlog-checker

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-common-rabbitmq-backlog-checker/microservice-common-rabbitmq-backlog-checker.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-common-rabbitmq-backlog-checker.out" \
]

