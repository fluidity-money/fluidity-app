-- migrate:up
-- add varchar temp_amount column
ALTER TABLE user_actions ADD COLUMN temp_amount VARCHAR;

-- cast amount to temp_amount
UPDATE user_actions SET temp_amount = CAST(amount AS VARCHAR);

-- drop uint256 amount column
ALTER TABLE user_actions DROP COLUMN amount;

-- rename temp_amount to amount
ALTER TABLE user_actions RENAME COLUMN temp_amount TO amount;

-- migrate:down
-- add uint256 temp_amount column
ALTER TABLE user_actions ADD COLUMN temp_amount uint256;

-- cast amount to temp_amount
UPDATE user_actions SET temp_amount = CAST(amount AS uint256);

-- drop varchar amount column
ALTER TABLE user_actions DROP COLUMN amount;

-- rename temp_amount to amount 
ALTER TABLE user_actions RENAME COLUMN temp_amount TO amount;

