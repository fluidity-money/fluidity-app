
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/connector-prize-pool-postgres

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"wait-for-database.sh", \
	"./connector-prize-pool-postgres.o" \
]
