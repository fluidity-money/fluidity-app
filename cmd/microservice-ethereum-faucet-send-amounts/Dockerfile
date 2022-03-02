
FROM fluidity/go-docker:latest

ENV REPO microservice-ethereum-faucet-send-amounts

ENV DIR /usr/src/${REPO}

COPY . ${DIR}

WORKDIR ${DIR}

RUN make

ENTRYPOINT [ "./microservice-ethereum-faucet-send-amounts" ]
