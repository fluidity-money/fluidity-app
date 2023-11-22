-- migrate:up

ALTER TYPE ethereum_application ADD VALUE IF NOT EXISTS 'trader_joe';

-- migrate:down
-- nothing here
