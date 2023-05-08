-- migrate:up

ALTER TABLE ethereum_pending_reward_type
    ADD COLUMN reward_tier INT;

-- migrate:down

ALTER TABLE ethereum_pending_reward_type
    DROP COLUMN reward_tier;

