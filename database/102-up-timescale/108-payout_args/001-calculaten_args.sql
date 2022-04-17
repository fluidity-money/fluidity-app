-- migrate:up

-- reusable datatypes across the postgres/timescale relations
-- since the backend's the same.

CREATE TABLE calculaten_args (
    -- network args belongs to
    network VARCHAR NOT NULL,

    -- dummy data
    crunchy BIGINT,
    smooth  BIGINT,

    -- time this tvl was recorded
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- migrate:down

DROP TABLE IF EXISTS calculaten_args;


