FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-prize-pool

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-ethereum-prize-pool/microservice-ethereum-prize-pool.o .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-ethereum-prize-pool.o" \
]

