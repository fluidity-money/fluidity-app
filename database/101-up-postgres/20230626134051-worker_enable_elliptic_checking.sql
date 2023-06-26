
-- migrate:up

CREATE TABLE worker_elliptic_screening (
	network network_blockchain NOT NULL,
	address VARCHAR NOT NULL UNIQUE,
	risky BOOLEAN NOT NULL,
	updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- migrate:down

DROP TABLE worker_elliptic_screening;
