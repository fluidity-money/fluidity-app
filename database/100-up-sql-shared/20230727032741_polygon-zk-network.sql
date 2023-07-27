-- migrate:up

ALTER TYPE network_blockchain ADD VALUE 'polygon_zk';

-- migrate:down

-- there's no good way to remove enum variants
