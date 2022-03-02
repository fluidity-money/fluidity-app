
FROM fluidity/go-docker:latest

ENV REPO microservice-solana-faucet-send-amounts

ENV DIR /usr/src/${REPO}

COPY . ${DIR}

WORKDIR ${DIR}

RUN make

ENTRYPOINT [ "./microservice-solana-faucet-send-amounts" ]
