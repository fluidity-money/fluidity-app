
FROM fluidity/go-docker:latest

ENV REPO microservice-solana-user-actions

ENV DIR /usr/src/${REPO}

COPY . ${DIR}

WORKDIR ${DIR}

RUN make

ENTRYPOINT [ \
    "wait-for-amqp", \
    "./microservice-solana-user-actions" \
]
