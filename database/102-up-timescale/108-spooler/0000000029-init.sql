
-- migrate:up

CREATE TABLE ethereum_pending_winners (
    token_short_name VARCHAR NOT NULL,
    token_decimals INT NOT NULL,
    transaction_hash VARCHAR NOT NULL,
    address VARCHAR NOT NULL,
    win_amount uint256 NOT NULL,
    block_number uint256 NOT NULL,
    reward_sent BOOLEAN NOT NULL DEFAULT false
);

-- migrate:down

DROP TABLE IF EXISTS ethereum_pending_winners;
