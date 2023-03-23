-- migrate:up

ALTER TABLE worker_config_ethereum
	ADD COLUMN epoch_blocks_size INTEGER NOT NULL
	DEFAULT 1;

ALTER TABLE worker_config_ethereum
	ALTER COLUMN epoch_blocks_size DROP DEFAULT;

-- 40 seconds

UPDATE worker_config_ethereum
	SET epoch_blocks_size = 120
	WHERE network = 'arbitrum';

UPDATE worker_config_ethereum
	SET epoch_blocks_size = 3
	WHERE network = 'ethereum';

-- migrate:down

ALTER TABLE worker_config_ethereum
	DROP_COLUMN epoch_blocks_size;
