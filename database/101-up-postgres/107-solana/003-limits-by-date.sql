-- migrate:up

DROP TABLE solana_mint_limits;

CREATE TABLE solana_mint_limits (
	date TIMESTAMP NOT NULL,
	token_short_name VARCHAR NOT NULL,
	mint_limit INT NOT NULL
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-06T00:00:00.000Z',
    'fUSDC',
    10000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-06T00:00:00.000Z',
    'fUSDT',
    10000

);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-07T00:00:00.000Z',
    'fUSDC',
    10000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-07T00:00:00.000Z',
    'fUSDT',
    10000

);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-08T00:00:00.000Z',
    'fUSDC',
    10000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-08T00:00:00.000Z',
    'fUSDT',
    10000

);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-09T00:00:00.000Z',
    'fUSDC',
    15000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-09T00:00:00.000Z',
    'fUSDT',
    15000

);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-10T00:00:00.000Z',
    'fUSDC',
    20000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-10T00:00:00.000Z',
    'fUSDT',
    20000

);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-11T00:00:00.000Z',
    'fUSDC',
    25000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-11T00:00:00.000Z',
    'fUSDT',
    25000

);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-12T00:00:00.000Z',
    'fUSDC',
    30000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-12T00:00:00.000Z',
    'fUSDT',
    30000

);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-13T00:00:00.000Z',
    'fUSDC',
    35000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-13T00:00:00.000Z',
    'fUSDT',
    35000

);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-14T00:00:00.000Z',
    'fUSDC',
    40000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-14T00:00:00.000Z',
    'fUSDT',
    40000

);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-15T00:00:00.000Z',
    'fUSDC',
    45000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-15T00:00:00.000Z',
    'fUSDT',
    45000

);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-16T00:00:00.000Z',
    'fUSDC',
    50000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-16T00:00:00.000Z',
    'fUSDT',
    50000

);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-17T00:00:00.000Z',
    'fUSDC',
    55000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-17T00:00:00.000Z',
    'fUSDT',
    55000

);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-18T00:00:00.000Z',
    'fUSDC',
    60000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-18T00:00:00.000Z',
    'fUSDT',
    60000

);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-19T00:00:00.000Z',
    'fUSDC',
    65000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-19T00:00:00.000Z',
    'fUSDT',
    65000

);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-20T00:00:00.000Z',
    'fUSDC',
    70000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-20T00:00:00.000Z',
    'fUSDT',
    70000

);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-21T00:00:00.000Z',
    'fUSDC',
    75000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-21T00:00:00.000Z',
    'fUSDT',
    75000

);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-22T00:00:00.000Z',
    'fUSDC',
    80000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-22T00:00:00.000Z',
    'fUSDT',
    80000

);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-23T00:00:00.000Z',
    'fUSDC',
    85000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-23T00:00:00.000Z',
    'fUSDT',
    85000

);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-24T00:00:00.000Z',
    'fUSDC',
    90000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-24T00:00:00.000Z',
    'fUSDT',
    90000

);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-25T00:00:00.000Z',
    'fUSDC',
    95000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-25T00:00:00.000Z',
    'fUSDT',
    95000

);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-26T00:00:00.000Z',
    'fUSDC',
    100000
);

INSERT INTO solana_mint_limits VALUES(
    '2022-12-26T00:00:00.000Z',
    'fUSDT',
    100000

);

-- migrate:down

DROP TABLE solana_mint_limits;

CREATE TABLE solana_mint_limits (
	token_short_name VARCHAR NOT NULL,
	token_decimals INT NOT NULL,
	mint_limit uint256 NOT NULL
);
