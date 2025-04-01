-- migrate:up

ALTER TABLE ethereum_pending_winners
    ADD COLUMN reward_tier INT NOT NULL
    DEFAULT 0;

ALTER TABLE ethereum_pending_winners
    ALTER COLUMN reward_tier DROP DEFAULT;

-- migrate:down

ALTER TABLE ethereum_pending_winners
    DROP COLUMN reward_tier;
