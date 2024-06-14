
-- migrate:up

ALTER TYPE ethereum_application ADD VALUE IF NOT EXISTS 'pancakeswap';

-- migrate:down

ALTER TYPE ethereum_application DROP VALUE 'pancakeswap';
