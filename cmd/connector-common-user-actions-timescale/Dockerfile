FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/connector-common-user-actions-timescale

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/connector-common-user-actions-timescale/connector-common-user-actions-timescale.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./connector-common-user-actions-timescale.o" \
]

