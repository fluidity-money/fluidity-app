FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-solana-user-actions

COPY . .

RUN make

FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-solana-user-actions/microservice-solana-user-actions.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-solana-user-actions.out" \
]
