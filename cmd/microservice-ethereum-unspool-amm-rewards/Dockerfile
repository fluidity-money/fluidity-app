FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-unspool-amm-rewards

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-ethereum-unspool-amm-rewards/microservice-ethereum-unspool-amm-rewards.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-ethereum-unspool-amm-rewards.out" \
]
