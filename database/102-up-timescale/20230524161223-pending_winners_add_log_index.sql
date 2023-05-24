-- migrate:up

ALTER TABLE ethereum_pending_winners
	ADD COLUMN log_index BIGINT NOT NULL DEFAULT 0;

-- migrate:down

ALTER TABLE ethereum_pending_winners
	DROP COLUMN log_index;
