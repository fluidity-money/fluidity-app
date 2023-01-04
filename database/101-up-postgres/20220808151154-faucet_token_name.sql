-- migrate:up

-- add the name of the requested token to have separate timers per token
ALTER TABLE faucet_users ADD token_name VARCHAR NOT NULL;

ALTER TABLE faucet_users ADD PRIMARY KEY(address, network, token_name);

-- migrate:down

ALTER TABLE faucet_users
	DROP COLUMN token_name;
