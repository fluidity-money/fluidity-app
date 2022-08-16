FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/connector-ethereum-logs-amqp

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/connector-ethereum-logs-amqp/connector-ethereum-logs-amqp.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./connector-ethereum-logs-amqp.o" \
]

