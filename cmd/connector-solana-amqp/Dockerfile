
FROM fluidity/go-docker:latest

ENV REPO connector-solana-amqp

ENV DIR /usr/src/${REPO}

COPY . ${DIR}

WORKDIR ${DIR}

RUN make

ENTRYPOINT [ \
    "wait-for-amqp", \
    "./connector-solana-amqp" \
]
