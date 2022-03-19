-- migrate:up

-- start tracking token details in the user actions, set the existing rows
-- to 6 due to them being USDT with a transaction

ALTER TABLE user_actions ADD token_short_name VARCHAR;

ALTER TABLE user_actions ADD token_decimals INT;

UPDATE user_actions SET token_short_name = 'USDT';

UPDATE user_actions SET token_decimals = 6;

ALTER TABLE user_actions ALTER COLUMN token_short_name SET NOT NULL;

ALTER TABLE user_actions ALTER COLUMN token_decimals SET NOT NULL;

-- migrate:down

ALTER TABLE user_actions
    DROP COLUMN IF EXISTS token_short_name,
    DROP COLUMN IF EXISTS token_decimals;

