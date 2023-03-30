-- migrate:up

CREATE TABLE staking_events (
    address VARCHAR NOT NULL,
    usd_amount BIGINT NOT NULL,
    lockup_length INT NOT NULL, -- integer number of days
    inserted_date TIMESTAMP NOT NULL	
);

-- migrate:down

DROP TABLE staking_events;
