FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-fanfare-fluidity-money

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-fanfare-fluidity-money/microservice-fanfare-fluidity-money.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-fanfare-fluidity-money.out" \
]
