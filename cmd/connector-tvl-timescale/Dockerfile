
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/connector-tvl-timescale

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./connector-tvl-timescale.o" \
]
