FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/connector-common-winners-timescale

COPY . .

RUN make

FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/connector-common-winners-timescale/connector-common-winners-timescale.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./connector-common-winners-timescale.out" \
]
