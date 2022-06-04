#!/usr/bin/env sh

cd $(dirname $0)/..

mkdir -p artifacts/deploy/

curl -L https://github.com/QuarryProtocol/quarry/releases/download/v5.0.1/quarry_mint_wrapper.so > \
    artifacts/deploy/quarry_mint_wrapper.so

curl -L https://github.com/QuarryProtocol/quarry/releases/download/v5.0.1/quarry_mine.so > \
    artifacts/deploy/quarry_mine.so

curl -L https://github.com/QuarryProtocol/quarry/releases/download/v5.0.1/quarry_operator.so > \
    artifacts/deploy/quarry_operator.so

curl -L https://github.com/TribecaHQ/tribeca/releases/download/v0.5.6/locked_voter.so > \
    artifacts/deploy/locked_voter.so

curl -L https://github.com/TribecaHQ/tribeca/releases/download/v0.5.6/govern.so > \
    artifacts/deploy/govern.so

curl -L https://github.com/GokiProtocol/goki/releases/download/v0.10.3/smart_wallet.so > \
    artifacts/deploy/smart_wallet.so
