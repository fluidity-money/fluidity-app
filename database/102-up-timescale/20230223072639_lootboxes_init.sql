-- migrate:up

CREATE TYPE lootbox_source AS ENUM ('airdrop', 'referral', 'transaction');

CREATE TABLE lootbox (
    address VARCHAR NOT NULL,
    source lootbox_source,
    transaction_hash VARCHAR,
    referrer VARCHAR,
    awarded_time TIMESTAMP NOT NULL 
);

-- migrate:down

DROP TABLE lootbox;

DROP TYPE lootbox_source;

