FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-track-amm-positions

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-ethereum-track-amm-positions/microservice-ethereum-track-amm-positions.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-ethereum-track-amm-positions.out" \
]
