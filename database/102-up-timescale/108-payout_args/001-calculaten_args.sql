-- migrate:up

-- reusable datatypes across the postgres/timescale relations
-- since the backend's the same.

CREATE TABLE calculaten_args (
    -- network args belongs to
    chain network_blockchain NOT NULL,
    network VARCHAR NOT NULL,

    delta SMALLINT NOT NULL,
    m SMALLINT NOT NULL,
    freq_div SMALLINT NOT NULL,

    -- time this tvl was recorded
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- migrate:down

DROP TABLE IF EXISTS calculaten_args;


