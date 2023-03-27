FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-track-transaction-attributes

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-ethereum-track-transaction-attributes/microservice-ethereum-track-transaction-attributes.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-ethereum-track-transaction-attributes.out" \
]
