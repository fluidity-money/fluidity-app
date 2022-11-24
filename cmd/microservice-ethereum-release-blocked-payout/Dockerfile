FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-release-blocked-payout

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-ethereum-release-blocked-payout/microservice-ethereum-release-blocked-payout.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-ethereum-release-blocked-payout.out" \
]
