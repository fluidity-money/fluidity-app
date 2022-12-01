-- migrate:up

ALTER TABLE ethereum_pending_winners
    ADD COLUMN inserted_date TIMESTAMP DEFAULT NOW(),
    ADD COLUMN reward_type reward_direction;

-- migrate:down
ALTER TABLE ethereum_pending_winners
    DROP COLUMN inserted_date,
    DROP COLUMN reward_type;
