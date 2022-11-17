-- migrate:up

-- clear table to add token name
-- since we can't know what tokens existing limits are for
DELETE FROM solana_users;

ALTER TABLE solana_users
	ADD COLUMN token_short_name VARCHAR NOT NULL,		

-- be unique on address and token, so remove address uniqueness
-- in favour of combined primary key
	ADD CONSTRAINT unique_address_token PRIMARY KEY (address, token_short_name),
	DROP CONSTRAINT solana_users_address_key;

-- migrate:down

ALTER TABLE solana_users
	DROP CONSTRAINT unique_address_token,
	DROP COLUMN token_short_name;		

-- aggregate all tokens into one
CREATE TABLE combined_amounts AS
	SELECT 
		address, 
		SUM(amount_minted), 
		MAX(last_updated)
	FROM solana_users 
	GROUP BY address;

DELETE FROM solana_users;

INSERT INTO solana_users
	SELECT * FROM combined_amounts;

DROP TABLE combined_amounts;

-- restore constraint
ALTER TABLE solana_users
	ADD UNIQUE(address);
