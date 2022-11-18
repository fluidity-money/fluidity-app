-- migrate:up

-- reusable datatypes across the postgres/timescale relations
-- since the backend's the same.

CREATE TABLE whitelisted_gauges (
    -- network args belongs to
	gauge VARCHAR NOT NULL,

    primary key(gauge)
);

-- migrate:down

DROP TABLE whitelisted_gauges;


