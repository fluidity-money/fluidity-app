-- migrate:up

ALTER TABLE past_winnings
    ADD COLUMN token_name VARCHAR NOT NULL;

-- migrate:down

ALTER TABLE past_winnings
    DROP COLUMN token_name;
