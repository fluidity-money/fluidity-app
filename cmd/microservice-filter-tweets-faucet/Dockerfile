
FROM fluidity/go-docker:latest

ENV REPO microservice-tweets-faucet

ENV DIR /usr/src/${REPO}

COPY . ${DIR}

WORKDIR ${DIR}

RUN make

ENTRYPOINT [ "./microservice-tweets-faucet" ]
