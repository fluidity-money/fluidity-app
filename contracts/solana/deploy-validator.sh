#!/bin/sh

# set config to local test validator
solana config set --url http://localhost:8899

# suppress output, as it's saved in a log anyway
solana-test-validator >/dev/null 2>&1 &

# wait 5 slots to ensure the network is ready for deployment
IS_READY=$(grep "slot:\ 5" test-ledger/validator.log 2>/dev/null || true)

while [ -z "${IS_READY}" ]
do
  echo Waiting for test validator to start...
  sleep 1
  IS_READY=$(grep "slot:\ 5" test-ledger/validator.log 2>/dev/null || true)
done

echo Validator ready - deploying program!

# deploy program
solana program deploy target/deploy/fluidity.so
