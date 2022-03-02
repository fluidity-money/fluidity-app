
ALTER TABLE user_actions
    ADD COLUMN solana_sender_owner_address VARCHAR,
    ADD COLUMN solana_recipient_owner_address VARCHAR;
