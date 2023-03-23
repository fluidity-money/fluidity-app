-- migrate:up

-- volume of the winning transaction
ALTER TABLE lootbox ADD volume BIGINT;
ALTER TABLE lootbox ADD reward_tier INT;
	-- total number of lootboxes won in this transaction based on volume & liquidity/protocol multipliers
ALTER TABLE lootbox ADD lootbox_count NUMERIC;

-- migrate:down

ALTER TABLE lootbox
 	DROP COLUMN volume,
 	DROP COLUMN reward_tier,
 	DROP COLUMN lootbox_count;
