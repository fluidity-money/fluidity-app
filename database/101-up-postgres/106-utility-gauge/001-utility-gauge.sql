-- migrate:up

-- reusable datatypes across the postgres/timescale relations
-- since the backend's the same.

CREATE TABLE utility_gauges (
    -- network args belongs to
    network VARCHAR NOT NULL,
	protocol VARCHAR NOT NULL,

	epoch BIGINT NOT NULL,
	total_power uint256 NOT NULL,

    primary key(network)
);

-- migrate:down

DROP TABLE utility_gauges;


