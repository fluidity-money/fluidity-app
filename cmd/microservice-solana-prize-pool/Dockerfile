
FROM fluidity/go-docker:latest

ENV REPO microservice-solana-prize-pool

ENV DIR /usr/src/${REPO}

COPY . ${DIR}

WORKDIR ${DIR}

RUN make

ENTRYPOINT [ "./microservice-solana-prize-pool" ]
