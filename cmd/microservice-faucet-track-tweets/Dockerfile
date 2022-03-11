
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-faucet-track-tweets

RUN make

ENTRYPOINT [ "./microservice-faucet-track-tweets.o" ]
