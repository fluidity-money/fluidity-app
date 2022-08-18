FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-worker-sender

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-ethereum-worker-sender/microservice-ethereum-worker-sender.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-ethereum-worker-sender.out" \
]
