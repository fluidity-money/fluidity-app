FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-address-linking

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-ethereum-address-linking/microservice-ethereum-address-linking.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-ethereum-address-linking.out" \
]
