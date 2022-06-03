FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-transaction-spooler

COPY . .

RUN make

ENTRYPOINT [ \
    "wait-for-amqp", \
    "wait-for-database.sh", \
    "./microservice-ethereum-transaction-spooler.o" \
]
