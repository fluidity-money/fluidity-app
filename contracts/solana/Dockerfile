
FROM rust:latest AS base

RUN sh -c "$(curl -sSfL https://release.solana.com/v1.9.5/install)"

ENV PATH="/root/.local/share/solana/install/active_release/bin:$PATH"

WORKDIR /usr/local/src/fluidity-solana

# only rebuild on source file change
COPY src src
COPY Cargo.toml ./
COPY Xargo.toml ./
COPY Cargo.lock ./

RUN ["cargo", "build-bpf"]

COPY . ./

FROM base AS test-validator

RUN solana-keygen new \
    --silent \
    --no-bip39-passphrase

WORKDIR /usr/local/src/fluidity-solana

RUN ./deploy-validator.sh

ENTRYPOINT ["solana-test-validator"]
