
FROM fluidity/go-docker:latest

ENV REPO microservice-user-actions

ENV DIR /usr/src/${REPO}

COPY . ${DIR}

WORKDIR ${DIR}



RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-user-actions" \
]
