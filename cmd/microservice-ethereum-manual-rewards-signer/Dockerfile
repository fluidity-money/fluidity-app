FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-manual-rewards-signer

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-ethereum-manual-rewards-signer/microservice-ethereum-manual-rewards-signer.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-ethereum-manual-rewards-signer.out" \
]
