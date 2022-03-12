
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/connector-user-actions-timescale

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"wait-for-database.sh", \
	"./connector-user-actions-timescale.o" \
]
