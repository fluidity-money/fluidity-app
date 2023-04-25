--migrate:up
-- trigger to calculate no. of lootboxes won from a winning transaction and save to lootbox table
CREATE FUNCTION update_lootboxes()
  RETURNS TRIGGER 
  LANGUAGE PLPGSQL
  AS
$$
BEGIN
	-- calculate values for boxes table
	INSERT INTO lootbox (
		address,
		source,
		transaction_hash,
		awarded_time,
		volume,
		reward_tier,
		lootbox_count
	)
	VALUES (
		NEW.address,
		'transaction',
		NEW.transaction_hash,
		NEW.awarded_time,
		NEW.volume,
		NEW.reward_tier,
		FLOOR(SUM(NEW.volume / (10 ^ NEW.token_decimals) / 3 + calculate_a_y(NEW.address, NEW.awarded_time)) * protocol_multiplier(NEW.ethereum_application))
	);
END;
$$;

CREATE TRIGGER trigger_lootbox_calculation
AFTER INSERT ON winning_transaction_attributes
FOR EACH ROW
EXECUTE PROCEDURE update_lootboxes();

--migrate:down

DROP TRIGGER IF EXISTS trigger_lootbox_calculation ON winning_transaction_attributes;
DROP FUNCTION IF EXISTS update_lootboxes;
