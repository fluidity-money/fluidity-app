
FROM fluidity/go-docker:latest

ENV REPO connector-ethlogs-amqp

ENV DIR /usr/src/${REPO}

COPY . ${DIR}

WORKDIR ${DIR}

RUN rewrite-go-mod.sh go.mod

RUN make

ENTRYPOINT [ \
	"wait-for-ws", \
	"wait-for-amqp", \
	"./connector-ethlogs-amqp" \
]
