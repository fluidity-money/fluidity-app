-- migrate:up

ALTER TABLE worker_config_ethereum
	ADD COLUMN atx_buffer_size INTEGER DEFAULT 0;

ALTER TABLE worker_config_solana
	ADD COLUMN atx_buffer_size INTEGER DEFAULT 0;

UPDATE worker_config_ethereum
	SET atx_buffer_size = 30
	WHERE network = 'ethereum';

UPDATE worker_config_solana SET atx_buffer_size = 30;

-- migrate:down

ALTER TABLE worker_config_ethereum DROP COLUMN atx_buffer_size;

ALTER TABLE worker_config_solana DROP COLUMN atx_buffer_size;
