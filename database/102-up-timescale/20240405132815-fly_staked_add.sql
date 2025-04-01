-- migrate:up

CREATE TABLE fly_staked (
	address VARCHAR NOT NULL UNIQUE,
	amount NUMERIC NOT NULL,
	amount_str VARCHAR NOT NULL,
	last_updated TIMESTAMP NOT NULL
);

-- migrate:down

DROP TABLE fly_staked;
