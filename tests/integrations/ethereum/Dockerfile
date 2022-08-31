FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/scripts/integrations/ethereum

COPY . .

RUN go test -c -o integration-test-runner-ethereum.out

ENTRYPOINT [ \
  "wait-for-amqp", \
  "./integration-test-runner-ethereum.out" \
]
    
