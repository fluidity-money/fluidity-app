
FROM fluidity/go-docker:latest

ENV REPO microservice-tweets-send-to-slack

ENV DIR /usr/src/${REPO}

COPY . ${DIR}

WORKDIR ${DIR}

RUN rewrite-go-mod.sh go.mod

RUN make

ENTRYPOINT [ "./microservice-tweets-send-to-slack" ]
