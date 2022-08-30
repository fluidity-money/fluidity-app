FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-key-rotation

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-key-rotation/microservice-key-rotation.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-key-rotation.out" \
]
