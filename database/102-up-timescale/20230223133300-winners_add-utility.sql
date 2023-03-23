-- migrate:up

ALTER TABLE winners
	ADD COLUMN utility_name VARCHAR DEFAULT 'FLUID';

-- migrate:down

ALTER TABLE winners
	DROP COLUMN utility_name;
