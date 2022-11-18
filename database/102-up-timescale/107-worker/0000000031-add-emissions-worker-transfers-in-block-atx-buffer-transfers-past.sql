-- migrate:up

ALTER TABLE worker_emissions
	ADD COLUMN atx_buffer_size INTEGER DEFAULT 0,
	ADD COLUMN transfers_in_block INTEGER DEFAULT 0,
	ADD COLUMN transfers_past VARCHAR DEFAULT '',
	ADD COLUMN seconds_since_last_block INTEGER DEFAULT 0;

-- migrate:down

ALTER TABLE worker_emissions
	DROP COLUMN atx_buffer_size,
	DROP COLUMN transfers_in_block,
	DROP COLUMN transfers_past,
	DROP COLUMN seconds_since_last_block;
