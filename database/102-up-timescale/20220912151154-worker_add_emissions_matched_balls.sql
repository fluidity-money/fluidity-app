-- migrate:up

ALTER TABLE worker_emissions
	ADD COLUMN matched_balls INTEGER DEFAULT 0;

-- migrate:down

ALTER TABLE worker_emissions
	DROP COLUMN matched_balls;
