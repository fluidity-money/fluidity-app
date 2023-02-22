
-- migrate:up

ALTER TYPE ethereum_application ADD VALUE IF NOT EXISTS 'saddle';

-- migrate:down
-- nothing here
