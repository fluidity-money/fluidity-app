FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/connector-common-blocked-payouts-reporting

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/connector-common-blocked-payouts-reporting/connector-common-blocked-payouts-reporting.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./connector-common-blocked-payouts-reporting.out" \
]
