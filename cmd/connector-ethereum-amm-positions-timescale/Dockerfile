FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/connector-ethereum-amm-positions-timescale

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/connector-ethereum-amm-positions-timescale/connector-ethereum-amm-positions-timescale.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./connector-ethereum-amm-positions-timescale.out" \
]
