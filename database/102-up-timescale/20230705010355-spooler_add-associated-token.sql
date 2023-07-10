-- migrate:up

ALTER TABLE ethereum_pending_winners
	ADD COLUMN category VARCHAR DEFAULT 'USDC';

ALTER TABLE ethereum_pending_winners
	ALTER COLUMN category DROP DEFAULT;

-- migrate:down

ALTER TABLE ethereum_pending_winners
	DROP COLUMN category;


