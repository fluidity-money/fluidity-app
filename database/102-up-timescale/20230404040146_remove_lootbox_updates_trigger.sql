-- migrate:up
DROP TRIGGER IF EXISTS trigger_lootbox_calculation ON winning_transaction_attributes;

DROP FUNCTION IF EXISTS update_lootboxes;

-- migrate:down

