-- migrate:up

-- a winning beta transaction, an almost-identical clone of the beta
-- transaction. both should be written in the event of a win.

CREATE TABLE beta_winning_transactions (
	transaction_hash VARCHAR NOT NULL,
	from_address VARCHAR NOT NULL,
	to_address VARCHAR NOT NULL,
	contract_call BOOLEAN NOT NULL,
	receiver_win_amount uint256 NOT NULL,
	sender_win_amount uint256 NOT NULL
);

-- migrate:down

DROP TABLE IF EXISTS beta_winnings_transactions;