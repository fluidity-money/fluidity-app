
FROM rust:latest

WORKDIR /usr/local/src/fluidity-solana

COPY . .

RUN ["cargo", "install", "cargo-geiger"]

CMD ["cargo", "geiger"]
