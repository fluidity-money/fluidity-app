
-- migrate:up

ALTER TYPE ethereum_application ADD VALUE IF NOT EXISTS 'camelot';

-- migrate:down
-- nothing here
