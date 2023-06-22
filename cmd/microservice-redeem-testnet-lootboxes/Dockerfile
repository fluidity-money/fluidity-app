FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-redeem-testnet-lootboxes

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-redeem-testnet-lootboxes/microservice-redeem-testnet-lootboxes.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-redeem-testnet-lootboxes.out" \
]
