
FROM fluidity/go-docker:latest

ENV REPO microservice-track-winners

ENV DIR /usr/src/${REPO}

COPY . ${DIR}

WORKDIR ${DIR}



RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-track-winners" \
]
