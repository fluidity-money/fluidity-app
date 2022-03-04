
FROM fluidity-money/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-faucet-send-amounts

RUN make

ENTRYPOINT [ "./microservice-ethereum-faucet-send-amounts" ]
