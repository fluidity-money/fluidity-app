-- migrate:up

-- user_actions is a high level representation of the user's actions
-- (swapping, sending) in the same table.

-- currently only USDT!

CREATE TABLE user_actions (
	-- event_number is useful with a graph database
	event_number BIGSERIAL NOT NULL,

	network network_blockchain NOT NULL,

	-- was this a send or a swap?
	type user_action NOT NULL,

	-- if the token was a swap into a Fluid Asset (if false, it was a
	-- swap out!)

	swap_in BOOLEAN,

	-- sender_address is the instigator of the action
	sender_address VARCHAR NOT NULL,

	-- if someone received this, may be NULL (if a swap!)
	recipient_address VARCHAR,

	-- amount that was sent/swapped
	amount uint256 NOT NULL,

	-- time that this transaction took place, may be null or set by
	-- the worker!
	time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- migrate:down

DROP TABLE IF EXISTS user_actions;
