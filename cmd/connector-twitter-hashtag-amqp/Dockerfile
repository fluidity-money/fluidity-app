
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/connector-twitter-hashtag-amqp

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./connector-twitter-hashtag-amqp.o" \
]
