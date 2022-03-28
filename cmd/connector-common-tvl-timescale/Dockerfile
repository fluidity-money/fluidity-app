
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/connector-common-tvl-timescale

COPY . .

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./connector-common-tvl-timescale.o" \
]
