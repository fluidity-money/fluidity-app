
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/connector-common-winners-timescale

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"wait-for-database.sh", \
	"./connector-common-winners-timescale.o" \
]
