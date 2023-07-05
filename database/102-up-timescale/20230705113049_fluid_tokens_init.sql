-- migrate:up
CREATE TABLE fluid_tokens (
    token_name VARCHAR NOT NULL
);

INSERT INTO fluid_tokens VALUES
    ('USDT'),
    ('USDC'),
    ('FRAX'),
    ('TUSD'),
    ('DAI');

-- migrate:down

DROP TABLE fluid_tokens;

