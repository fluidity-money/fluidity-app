-- migrate:up

ALTER TABLE user_actions
	ADD COLUMN log_index BIGINT NOT NULL DEFAULT 0;

-- migrate:down

ALTER TABLE user_actions
	DROP COLUMN log_index;
