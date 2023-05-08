
-- migrate:up

ALTER TYPE ethereum_application ADD VALUE IF NOT EXISTS 'chronos';

-- migrate:down
-- nothing here
