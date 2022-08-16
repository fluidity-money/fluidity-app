FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-user-actions

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-ethereum-user-actions/microservice-ethereum-user-actions.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-ethereum-user-actions.o" \
]

