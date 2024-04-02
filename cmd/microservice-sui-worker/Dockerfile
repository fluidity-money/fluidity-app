FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-worker-sui

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-worker-sui/microservice-worker-sui.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-worker-sui.out" \
]
