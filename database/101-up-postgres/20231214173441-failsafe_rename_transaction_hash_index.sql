
-- migrate:up

ALTER TABLE failsafe_transaction_hash RENAME TO failsafe_transaction_hash_log_index;

-- migrate:down

ALTER TABLE failsafe_transaction_hash_log_index RENAME TO failsafe_transaction_hash;
