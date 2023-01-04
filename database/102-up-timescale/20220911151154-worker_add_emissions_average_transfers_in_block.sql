-- migrate:up

ALTER TABLE worker_emissions
	ADD COLUMN average_transfers_in_block DOUBLE PRECISION DEFAULT 0;

-- migrate:down

ALTER TABLE worker_emissions
	DROP COLUMN average_transfers_in_block;
