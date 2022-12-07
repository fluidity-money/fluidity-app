FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/connector-ethereum-reward-logs-amqp

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/connector-ethereum-reward-logs-amqp/connector-ethereum-reward-logs-amqp.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./connector-ethereum-reward-logs-amqp.out" \
]
