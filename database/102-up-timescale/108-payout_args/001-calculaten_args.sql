-- migrate:up

-- reusable datatypes across the postgres/timescale relations
-- since the backend's the same.

CREATE TABLE calculaten_args (
    -- network args belongs to
    chain network_blockchain NOT NULL,
    network VARCHAR NOT NULL,

    payout_freq_num BIGINT NOT NULL,
    payout_freq_denom BIGINT NOT NULL,
    delta_weight_num BIGINT NOT NULL,
    delta_weight_denom BIGINT NOT NULL,
    winning_classes INT NOT NULL,

    -- time this tvl was recorded
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- migrate:down

DROP TABLE IF EXISTS calculaten_args;


