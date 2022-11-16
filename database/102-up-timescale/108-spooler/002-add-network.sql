-- migrate:up

ALTER TABLE ethereum_pending_winners
    ADD COLUMN network network_blockchain NOT NULL
    DEFAULT 'ethereum';

ALTER TABLE ethereum_pending_winners
    ALTER COLUMN network DROP DEFAULT;

-- migrate:down

ALTER TABLE ethereum_pending_winners
    DROP COLUMN network;
