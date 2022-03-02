
FROM fluidity/go-docker:latest

ENV REPO repo-name-here

ENV DIR /usr/src/${REPO}

COPY . ${DIR}

WORKDIR ${DIR}

RUN rewrite-go-mod.sh go.mod

RUN make

ENTRYPOINT [ "./repo-name-here" ]
