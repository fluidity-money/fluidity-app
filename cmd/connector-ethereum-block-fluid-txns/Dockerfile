
FROM fluidity/go-docker:latest

ENV REPO connector-block-fluid-transactions

ENV DIR /usr/src/${REPO}

COPY . ${DIR}

WORKDIR ${DIR}

RUN make

ENTRYPOINT [ "./connector-block-fluid-transactions" ]
