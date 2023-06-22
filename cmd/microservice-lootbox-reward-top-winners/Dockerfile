FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-lootbox-reward-top-winners

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-lootbox-reward-top-winners/microservice-lootbox-reward-top-winners.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-lootbox-reward-top-winners.out" \
]
