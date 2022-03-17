-- migrate:up

-- add the name of the requested token to have separate timers per token
BEGIN;

ALTER TABLE faucet_users ADD token_name VARCHAR NOT NULL;

ALTER TABLE faucet_users ADD PRIMARY KEY(address, network, token_name);

COMMIT;

-- migrate:down

ALTER TABLE faucet_users 
    DROP COLUMN IF EXISTS token_name;

