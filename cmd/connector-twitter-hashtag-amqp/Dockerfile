
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/connector-twitter-hashtag-amqp

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./connector-twitter-fluidity-hashtag-amqp.o" \
]
