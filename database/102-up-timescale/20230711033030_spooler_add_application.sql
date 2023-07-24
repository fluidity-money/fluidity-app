-- migrate:up
ALTER TABLE ethereum_pending_winners
	ADD COLUMN application VARCHAR NOT NULL DEFAULT 'none';

-- migrate:down

ALTER TABLE ethereum_pending_winners
	DROP COLUMN application;

