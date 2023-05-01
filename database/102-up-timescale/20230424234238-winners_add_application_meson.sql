
-- migrate:up

ALTER TYPE ethereum_application ADD VALUE IF NOT EXISTS 'meson';

-- migrate:down
-- nothing here
