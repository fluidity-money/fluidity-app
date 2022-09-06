FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-key-rotation-generate-transaction

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-key-rotation-generate-transaction/microservice-key-rotation-generate-transaction.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-key-rotation-generate-transaction.out" \
]
