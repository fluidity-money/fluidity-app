-- migrate:up

-- spooler knows about send txn hash
-- sender knows about send and reward txn hash
-- track-winners knows about reward txn hash
-- therefore, use separate columns to save both send/receive direction as well as the necessary transaction hashes

ALTER TABLE ethereum_pending_reward_type
    RENAME COLUMN transaction_hash TO send_transaction_hash;

ALTER TABLE ethereum_pending_reward_type 
    ALTER COLUMN send_transaction_hash DROP NOT NULL,
    ADD COLUMN reward_transaction_hash VARCHAR;

-- migrate:down

ALTER TABLE ethereum_pending_reward_type
    RENAME COLUMN send_transaction_hash TO transaction_hash;

ALTER TABLE ethereum_pending_reward_type
    ALTER COLUMN transaction_hash SET NOT NULL,
    DROP COLUMN reward_transaction_hash;

