-- migrate:up

ALTER TABLE user_actions
	ADD COLUMN log_index BIGINT;

-- migrate:down

ALTER TABLE user_actions
	DROP COLUMN log_index;
