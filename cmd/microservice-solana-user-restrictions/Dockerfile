FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-solana-user-restrictions

COPY . .

RUN make

FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-solana-user-restrictions/microservice-solana-user-restrictions.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-solana-user-restrictions.out" \
]
