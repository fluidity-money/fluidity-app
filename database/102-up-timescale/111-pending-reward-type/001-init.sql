-- migrate:up

CREATE TABLE ethereum_pending_reward_type (
    transaction_hash VARCHAR NOT NULL,
    winner_address VARCHAR NOT NULL,
    is_sender BOOLEAN NOT NULL,
    application application
);

-- migrate:down

DROP TABLE ethereum_pending_reward_type;
