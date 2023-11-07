-- migrate:up

ALTER TYPE ethereum_application ADD VALUE IF NOT EXISTS 'seawater-amm';

-- migrate:down
-- nothing here
