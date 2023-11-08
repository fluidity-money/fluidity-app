-- migrate:up

ALTER TYPE network_blockchain ADD VALUE 'stylus_testnet';

-- migrate:down

-- there's no good way to remove enum variants
