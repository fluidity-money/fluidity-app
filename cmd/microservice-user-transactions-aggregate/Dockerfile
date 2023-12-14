FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-user-transactions-aggregate

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-user-transactions-aggregate/microservice-user-transactions-aggregate.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-user-transactions-aggregate.out" \
]
