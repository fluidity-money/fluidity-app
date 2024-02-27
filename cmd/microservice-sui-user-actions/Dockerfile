FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-user-actions-sui

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-user-actions-sui/microservice-user-actions-sui.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-user-actions-sui.out" \
]
