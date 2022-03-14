-- migrate:up

ALTER TABLE user_actions
    ADD COLUMN solana_sender_owner_address VARCHAR,
    ADD COLUMN solana_recipient_owner_address VARCHAR;

-- migrate:down

ALTER TABLE user_actions
    DROP COLUMN IF EXISTS solana_sender_owner_address,
    DROP COLUMN IF EXISTS solana_recipient_owner_address;