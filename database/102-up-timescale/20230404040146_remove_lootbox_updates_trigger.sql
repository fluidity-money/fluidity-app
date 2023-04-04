-- migrate:up
DROP IF EXISTS TRIGGER trigger_lootbox_calculation;
DROP IF EXISTS FUNCTION update_lootboxes;

-- migrate:down

