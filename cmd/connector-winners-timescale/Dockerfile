
FROM fluidity/go-docker:latest

ENV REPO connector-winners-timescale

ENV DIR /usr/src/${REPO}

COPY . ${DIR}

WORKDIR ${DIR}

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"wait-for-database.sh", \
	"./connector-winners-timescale" \
]
