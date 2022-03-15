
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/connector-common-twitter-hashtag-amqp

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./connector-common-twitter-hashtag-amqp.o" \
]
