
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-solana-tribeca-executor

COPY . .

RUN apt install -y \
    npm 

RUN make build

ENTRYPOINT [ "npx", "ts-node", "-O", "'{\"resolveJsonModule\":true}'", "microservice-solana-tribeca-executor.ts" ]
