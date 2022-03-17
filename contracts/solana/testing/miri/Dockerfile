
FROM rustlang/rust:nightly

RUN ["rustup", "default", "nightly"]

RUN ["rustup", "component", "add", "miri"]

WORKDIR /usr/local/src/fluidity-solana

COPY . .

CMD ["cargo", "miri", "test"]
