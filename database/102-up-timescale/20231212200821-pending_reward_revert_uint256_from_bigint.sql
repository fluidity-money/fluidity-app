
-- migrate:up

ALTER TABLE ethereum_pending_reward_type
	ALTER COLUMN win_amount TYPE BIGINT;

-- migrate:down

ALTER TABLE ethereum_pending_reward_type
	ALTER COLUMN win_amount TYPE uint256;
