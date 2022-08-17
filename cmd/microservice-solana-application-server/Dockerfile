FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-solana-application-server

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-solana-application-server/microservice-solana-application-server.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-solana-application-server.out" \
]

