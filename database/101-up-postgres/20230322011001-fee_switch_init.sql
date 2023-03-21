
-- migrate:up

CREATE TABLE fee_switch (
	network network_blockchain NOT NULL,
	original_address VARCHAR NOT NULL,
	new_address VARCHAR NOT NULL,
	created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- migrate:down

DROP TABLE fee_switch;
