
FROM fluidity/go-docker:latest

ENV REPO connector-geth-amqp

ENV DIR /usr/src/${REPO}

WORKDIR ${DIR}

COPY . .

RUN rewrite-go-mod.sh go.mod

RUN make build

ENTRYPOINT [ \
	"wait-for-ws", \
	"wait-for-amqp", \
	"./connector-geth-amqp" \
]
