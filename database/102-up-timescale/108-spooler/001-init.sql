
-- migrate:up

CREATE TABLE ethereum_pending_winners (
    token_short_name VARCHAR NOT NULL,
    transaction_hash VARCHAR NOT NULL,
    sender_address VARCHAR NOT NULL,
    recipient_address VARCHAR NOT NULL,
    win_amount uint256 NOT NULL,
    reward_sent BOOLEAN NOT NULL DEFAULT false
);

-- migrate:down

DROP TABLE IF EXISTS ethereum_pending_winners;
