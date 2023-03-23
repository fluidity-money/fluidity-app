-- migrate:up

CREATE TABLE staking_events (
    address VARCHAR,
    usd_amount BIGINT,
    lockup_length INT, -- integer number of days
    inserted_date TIMESTAMP	
);

-- migrate:down

DROP TABLE staking_events;
