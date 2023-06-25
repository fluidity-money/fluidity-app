
-- migrate:up

ALTER TYPE ethereum_application ADD VALUE IF NOT EXISTS 'kyber_classic';

-- migrate:down
-- nothing here
