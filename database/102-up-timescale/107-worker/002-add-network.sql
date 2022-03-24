-- migrate:up

ALTER TABLE worker_buffered_atx
	ADD COLUMN network network_blockchain NOT NULL;

-- migrate:down

ALTER TABLE worker_buffered_atx
	DROP COLUMN IF EXISTS network_blockchain; 

