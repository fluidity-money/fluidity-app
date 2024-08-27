
-- migrate:up

ALTER TYPE network_blockchain ADD VALUE 'superposition_testnet';

ALTER TYPE network_blockchain ADD VALUE 'superposition_mainnet';

-- migrate:down
