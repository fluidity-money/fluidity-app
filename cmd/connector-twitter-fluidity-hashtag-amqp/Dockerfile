
FROM fluidity/go-docker:latest

ENV REPO connector-twitter-fluidity-hashtag-amqp

ENV DIR /usr/src/${REPO}

COPY . ${DIR}

WORKDIR ${DIR}



RUN make

ENTRYPOINT [ "./connector-twitter-fluidity-hashtag-amqp" ]
