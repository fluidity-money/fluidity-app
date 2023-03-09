FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-automatic-payout-release

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-ethereum-automatic-payout-release/microservice-ethereum-automatic-payout-release.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-ethereum-automatic-payout-release.out" \
]
