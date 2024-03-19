-- migrate:up

ALTER TABLE worker_emissions
	ADD COLUMN sui_checkpoint_number UINT256;

-- migrate:down

ALTER TABLE worker_emissions
	DROP COLUMN sui_checkpoint_number;
