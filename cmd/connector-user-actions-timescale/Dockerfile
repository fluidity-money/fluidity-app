
FROM fluidity/go-docker:latest

ENV REPO connector-user-actions-timescale

ENV DIR /usr/src/${REPO}

COPY . ${DIR}

WORKDIR ${DIR}

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"wait-for-database.sh", \
	"./connector-user-actions-timescale" \
]
