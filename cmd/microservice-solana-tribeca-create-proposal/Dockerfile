
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-solana-tribeca-create-proposal

RUN apt-get install -y \
    npm

COPY . .

RUN make

ENTRYPOINT [ \
	"./start.sh" \
]
