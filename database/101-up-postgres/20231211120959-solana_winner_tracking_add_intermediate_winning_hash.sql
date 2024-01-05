
-- migrate:up

CREATE TABLE solana_intermediate_winners (
	created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	winning_signature VARCHAR NOT NULL, -- corresponds to winners send_transaction_hash
	payout_signature VARCHAR NOT NULL -- corresponds to winners transaction_hash
);

-- migrate:down

DROP TABLE solana_intermediate_winners;
