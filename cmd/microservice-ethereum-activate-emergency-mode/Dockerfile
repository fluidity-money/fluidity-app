FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-activate-emergency-mode

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-ethereum-activate-emergency-mode/microservice-ethereum-activate-emergency-mode.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-ethereum-activate-emergency-mode.out" \
]
