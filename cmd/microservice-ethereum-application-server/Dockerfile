FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-application-server

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-ethereum-application-server/microservice-ethereum-application-server.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-ethereum-application-server.o" \
]

