FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-create-transaction-lootboxes

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-ethereum-create-transaction-lootboxes/microservice-ethereum-create-transaction-lootboxes.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"wait-for-db", \
	"./microservice-ethereum-create-transaction-lootboxes.out" \
]
