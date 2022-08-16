FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/connector-common-tvl-timescale

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/connector-common-tvl-timescale/connector-common-tvl-timescale.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./connector-common-tvl-timescale.o" \
]

