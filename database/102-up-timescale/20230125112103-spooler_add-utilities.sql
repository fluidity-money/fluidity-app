-- migrate:up

ALTER TABLE ethereum_pending_winners
	ADD COLUMN utility_name VARCHAR DEFAULT 'FLUID' NOT NULL,
	ADD COLUMN usd_win_amount DOUBLE PRECISION DEFAULT 0.0;

UPDATE ethereum_pending_winners
	SET usd_win_amount = CAST(win_amount as double precision) / (10 ^ token_decimals);


ALTER TABLE ethereum_pending_winners
	ALTER COLUMN utility_name DROP DEFAULT,
	ALTER COLUMN usd_win_amount DROP DEFAULT;

-- migrate:down

ALTER TABLE ethereum_pending_winners
	DROP COLUMN utility_name,
	DROP COLUMN usd_win_amount;
