-- migrate:up

CREATE TABLE winning_transaction_attributes (
    token_short_name VARCHAR NOT NULL,
    token_decimals INT NOT NULL,
    network network_blockchain NOT NULL,
	awarded_time TIMESTAMP NOT NULL,
    address VARCHAR NOT NULL,
    transaction_hash VARCHAR NOT NULL,
    volume BIGINT NOT NULL,
    reward_tier INT NOT NULL,
    application ethereum_application NOT NULL -- 'none' is a regular send
);

-- migrate:down

DROP TABLE winning_transaction_attributes;
