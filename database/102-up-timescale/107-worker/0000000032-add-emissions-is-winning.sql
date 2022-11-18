-- migrate:up

ALTER TABLE worker_emissions
	ADD COLUMN naive_is_winning_is_winning BOOLEAN NOT NULL DEFAULT FALSE;

-- migrate:down

ALTER TABLE worker_emissions
	DROP COLUMN naive_is_winning_is_winning;
