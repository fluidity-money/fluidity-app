
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-solana-tribeca-executor

COPY . .

RUN make build

ENTRYPOINT [ "./start.sh" ]
