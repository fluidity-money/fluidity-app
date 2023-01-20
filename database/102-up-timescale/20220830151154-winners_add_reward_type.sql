-- migrate:up

CREATE TYPE reward_direction AS ENUM  ('send', 'receive');
ALTER TABLE winners
	ADD COLUMN reward_type reward_direction;

-- migrate:down

ALTER TABLE winners
	DROP COLUMN reward_type;	

DROP TYPE reward_direction;

