-- migrate:up

ALTER TYPE ethereum_application ADD VALUE IF NOT EXISTS 'apeswap';

-- migrate:down
-- nothing here
