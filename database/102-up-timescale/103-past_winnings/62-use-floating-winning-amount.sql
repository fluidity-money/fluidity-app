-- migrate:up

ALTER TABLE past_winnings
	ALTER COLUMN winning_amount TYPE DOUBLE PRECISION;

-- migrate:down

ALTER TABLE past_winnings
	ALTER COLUMN winning_amount TYPE uint256,
	ALTER COLUMN winning_amount SET NOT NULL;
