
FROM fluidity/go-docker:latest

ENV REPO microservice-track-prize-pool

ENV DIR /usr/src/${REPO}

COPY . ${DIR}

WORKDIR ${DIR}



RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-track-prize-pool" \
]
