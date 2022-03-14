-- migrate:up

-- add token details to make it easier to track winners that happen and
-- their token name/decimal conversions. set the existing decimals to 6
-- and the existing the

BEGIN;

ALTER TABLE winners ADD token_short_name VARCHAR;

ALTER TABLE winners ADD token_decimals INT;

UPDATE winners SET token_short_name = 'USDT';

UPDATE winners SET token_decimals = 6;

ALTER TABLE winners ALTER COLUMN token_short_name SET NOT NULL;

ALTER TABLE winners ALTER COLUMN token_decimals SET NOT NULL;

COMMIT;

-- migrate:down

ALTER TABLE winners
    DROP COLUMN IF EXISTS token_short_name,
    DROP COLUMN IF EXISTS token_decimals;
