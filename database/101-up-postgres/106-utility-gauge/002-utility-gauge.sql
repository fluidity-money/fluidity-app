-- migrate:up

-- reusable datatypes across the postgres/timescale relations
-- since the backend's the same.

CREATE TABLE utility_gauges (
    -- network args belongs to
	chain network_blockchain NOT NULL,
    network VARCHAR NOT NULL,
	gauge VARCHAR NOT NULL,

	epoch BIGINT NOT NULL,
	disabled BOOLEAN NOT NULL,
	total_power uint256 NOT NULL,

    primary key(gauge)
);

-- migrate:down

DROP TABLE utility_gauges;


