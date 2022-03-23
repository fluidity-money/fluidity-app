-- migrate:up

-- winners that were paid out in the past,

CREATE TABLE winners (
	network network_blockchain NOT NULL,
	transaction_hash VARCHAR NOT NULL,
	winning_address VARCHAR NOT NULL,
	winning_amount uint256 NOT NULL,

	-- the timestamp for when this was won
	awarded_time TIMESTAMP NOT NULL,

	created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- migrate:down

DROP TABLE IF EXISTS winners;

