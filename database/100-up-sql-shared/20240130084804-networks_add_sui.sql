-- migrate:up

ALTER TYPE network_blockchain ADD VALUE 'sui';

-- migrate:down

-- this is not possible easily so we won't bother!
