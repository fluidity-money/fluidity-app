-- migrate:up

-- add varchar amount_str not null column to user_actions casting amount
ALTER TABLE user_actions ADD COLUMN amount_str VARCHAR NOT NULL DEFAULT '0';

UPDATE user_actions SET amount_str = CAST(amount AS VARCHAR);

-- migrate:down
ALTER TABLE user_actions DROP COLUMN amount_str;

