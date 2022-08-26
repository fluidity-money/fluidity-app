FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-worker-client

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-ethereum-worker-client/microservice-ethereum-worker-client.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-ethereum-worker-client.out" \
]

