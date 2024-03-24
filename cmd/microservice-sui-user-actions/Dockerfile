FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-sui-user-actions

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-sui-user-actions/microservice-sui-user-actions.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-sui-user-actions.out" \
]
