
FROM fluidity/go-docker:latest

ENV REPO microservice-count-wins

ENV DIR /usr/src/${REPO}

COPY . ${DIR}

WORKDIR ${DIR}

RUN rewrite-go-mod.sh go.mod

RUN make

ENTRYPOINT [ "./microservice-count-wins" ]
