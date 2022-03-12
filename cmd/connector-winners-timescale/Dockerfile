
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/connector-winners-timescale

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"wait-for-database.sh", \
	"./connector-winners-timescale.o" \
]
