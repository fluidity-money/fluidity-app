
-- migrate:up

ALTER TYPE ethereum_application ADD VALUE IF NOT EXISTS 'wombat';

-- migrate:down
-- nothing here
