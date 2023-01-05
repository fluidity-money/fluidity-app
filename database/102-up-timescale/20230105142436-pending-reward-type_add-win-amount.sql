-- migrate:up

ALTER TABLE ethereum_pending_reward_type
    ADD COLUMN win_amount BIGINT NOT NULL DEFAULT 0;

ALTER TABLE ethereum_pending_reward_type
    ALTER COLUMN win_amount DROP DEFAULT;


-- migrate:down

ALTER TABLE ethereum_pending_reward_type
    DROP COLUMN win_amount;

