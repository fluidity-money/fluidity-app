FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/connector-ethereum-linked-addresses-timescale

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/connector-ethereum-linked-addresses-timescale/connector-ethereum-linked-addresses-timescale.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./connector-ethereum-linked-addresses-timescale.out" \
]
