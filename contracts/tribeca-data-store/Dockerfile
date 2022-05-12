
FROM rust:latest AS base

RUN sh -c "$(curl -sSfL https://release.solana.com/v1.9.5/install)"

RUN sh -c "$(cargo install --git https://github.com/project-serum/anchor --tag v0.24.2 anchor-cli --locked)"

RUN sh -c "$(sudo apt-get update && sudo apt-get upgrade && sudo apt-get install -y pkg-config build-essential libudev-dev)"

ENV PATH="/root/.local/share/solana/install/active_release/bin:$PATH"

# only rebuild on source file change
COPY src src
COPY scripts scripts
COPY Anchor.toml ./
COPY Cargo.toml ./
COPY Cargo.lock ./

RUN ["anchor", "build"]

COPY . ./

FROM base AS test-validator

RUN solana-keygen new \
    --silent \
    --no-bip39-passphrase

WORKDIR /usr/local/src/fluidity-tribeca-data-store

RUN ./scripts/deploy-validator.sh

ENTRYPOINT ["solana-test-validator"]
