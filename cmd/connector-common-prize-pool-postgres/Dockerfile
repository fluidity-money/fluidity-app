
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/connector-common-prize-pool-postgres

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"wait-for-database.sh", \
	"./connector-common-prize-pool-postgres.o" \
]
