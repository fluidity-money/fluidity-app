-- migrate:up

-- add the network and token name

ALTER TABLE ethereum_pending_reward_type
    ADD COLUMN network network_blockchain NOT NULL DEFAULT 'ethereum',
    ADD COLUMN token_short_name VARCHAR NOT NULL DEFAULT '';

ALTER TABLE ethereum_pending_reward_type
    ALTER COLUMN network DROP DEFAULT,
    ALTER COLUMN token_short_name DROP DEFAULT;

-- migrate:down

ALTER TABLE ethereum_pending_reward_type
    DROP COLUMN network,
    DROP COLUMN token_short_name;
