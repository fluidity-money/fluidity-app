-- migrate:up

-- update the prize pool container to use floats instead for the prize
-- pool amount so we can aggregate and do conversions to USDT in the backend

UPDATE prize_pool SET amount = amount / 1e6;

ALTER TABLE prize_pool ALTER COLUMN amount TYPE FLOAT;

-- migrate:down

