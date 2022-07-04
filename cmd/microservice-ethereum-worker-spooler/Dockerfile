FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-worker-spooler

COPY . .

RUN make

ENTRYPOINT [ \
    "wait-for-amqp", \
    "wait-for-database.sh", \
    "./microservice-ethereum-worker-spooler.o" \
]
