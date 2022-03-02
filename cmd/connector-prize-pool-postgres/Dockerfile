
FROM fluidity/go-docker:latest

ENV REPO connector-prize-pool-postgres

ENV DIR /usr/src/${REPO}

COPY . ${DIR}

WORKDIR ${DIR}

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"wait-for-database.sh", \
	"./connector-prize-pool-postgres" \
]
