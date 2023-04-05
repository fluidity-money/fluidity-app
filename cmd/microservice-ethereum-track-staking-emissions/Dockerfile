FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-track-staking-emissions

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-ethereum-track-staking-emissions/microservice-ethereum-track-staking-emissions.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-ethereum-track-staking-emissions.out" \
]
