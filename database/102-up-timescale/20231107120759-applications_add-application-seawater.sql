-- migrate:up

ALTER TYPE ethereum_application ADD VALUE IF NOT EXISTS 'seawater_amm';

-- migrate:down
-- nothing here
