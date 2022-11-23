FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-release-blocked-payout.go

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-ethereum-release-blocked-payout.go/microservice-ethereum-release-blocked-payout.go.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-ethereum-release-blocked-payout.go.out" \
]
