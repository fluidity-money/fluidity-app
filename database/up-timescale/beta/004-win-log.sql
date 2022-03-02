
-- win log contains information from the rng microservice

CREATE TABLE beta_win_logs (
    block_hash VARCHAR NOT NULL,
    transaction_index DECIMAL NOT NULL,
    win_amount uint256 NOT NULL
);
