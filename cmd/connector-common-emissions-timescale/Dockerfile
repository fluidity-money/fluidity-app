
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/connector-common-emissions-timescale

COPY . .

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"wait-for-database.sh", \
	"./connector-common-emissions-timescale.o" \
]

