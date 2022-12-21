-- migrate:up

ALTER TABLE ethereum_pending_winners
    ADD COLUMN utility VARCHAR NOT NULL
    DEFAULT '';

-- migrate:down

ALTER TABLE ethereum_pending_winners
    DROP COLUMN utility;
