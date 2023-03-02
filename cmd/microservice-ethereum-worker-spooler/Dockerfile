FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-worker-spooler

COPY . .

RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-ethereum-worker-spooler/microservice-ethereum-worker-spooler.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"wait-for-database.sh", \
	"./microservice-ethereum-worker-spooler.out" \
]

