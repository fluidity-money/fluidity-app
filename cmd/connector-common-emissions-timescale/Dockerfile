FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/connector-common-emissions-timescale

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/connector-common-emissions-timescale/connector-common-emissions-timescale.o .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./connector-common-emissions-timescale.o" \
]

