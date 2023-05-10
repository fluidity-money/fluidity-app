-- migrate:up

ALTER TABLE winners
	ADD COLUMN send_transaction_log_index BIGINT NOT NULL DEFAULT 0;

-- migrate:down

ALTER TABLE winners
	DROP COLUMN send_transaction_log_index;	
