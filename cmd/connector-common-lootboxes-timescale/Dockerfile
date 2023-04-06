
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/connector-common-lootboxes-timescale

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"wait-for-database.sh", \
	"./connector-common-lootboxes-timescale.o" \
]
