-- migrate:up

DROP TABLE solana_mint_limits;

CREATE TABLE solana_mint_limits (
	date TIMESTAMP NOT NULL,
	usdc INT NOT NULL,
	usdt INT NOT NULL
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-06T00:00:00.000Z',
    10000,
    10000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-07T00:00:00.000Z',
    10000,
    10000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-08T00:00:00.000Z',
    10000,
    10000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-09T00:00:00.000Z',
    15000,
    15000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-10T00:00:00.000Z',
    20000,
    20000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-11T00:00:00.000Z',
    25000,
    25000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-12T00:00:00.000Z',
    30000,
    30000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-13T00:00:00.000Z',
    35000,
    35000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-14T00:00:00.000Z',
    40000,
    40000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-15T00:00:00.000Z',
    45000,
    45000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-16T00:00:00.000Z',
    50000,
    50000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-17T00:00:00.000Z',
    55000,
    55000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-18T00:00:00.000Z',
    60000,
    60000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-19T00:00:00.000Z',
    65000,
    65000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-20T00:00:00.000Z',
    70000,
    70000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-21T00:00:00.000Z',
    75000,
    75000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-22T00:00:00.000Z',
    80000,
    80000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-23T00:00:00.000Z',
    85000,
    85000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-24T00:00:00.000Z',
    90000,
    90000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-25T00:00:00.000Z',
    95000,
    95000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-26T00:00:00.000Z',
    100000,
    100000
);

-- migrate:down

DROP TABLE solana_mint_limits;

CREATE TABLE solana_mint_limits (
	token_short_name VARCHAR NOT NULL,
	token_decimals INT NOT NULL,
	mint_limit uint256 NOT NULL
);
