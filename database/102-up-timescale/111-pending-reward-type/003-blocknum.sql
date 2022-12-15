-- migrate:up

-- each reward emitted has a block range
-- use that instead of manually storing the reward txn hash,
-- since manual rewards cant write their hash to the db

ALTER TABLE ethereum_pending_reward_type
    DROP COLUMN reward_transaction_hash,
    ADD COLUMN block_number BIGINT NOT NULL DEFAULT 0;

ALTER TABLE ethereum_pending_reward_type
    ALTER COLUMN block_number DROP DEFAULT;

-- migrate:down

ALTER TABLE ethereum_pending_reward_type
    ADD COLUMN reward_transaction_hash VARCHAR,
    DROP COLUMN block_number;

