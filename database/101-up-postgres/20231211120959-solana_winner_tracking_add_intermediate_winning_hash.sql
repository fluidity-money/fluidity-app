
-- migrate:up

CREATE TABLE solana_intermediate_winners (
	created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	winning_signature VARCHAR NOT NULL,
	payout_signature VARCHAR NOT NULL
);

-- migrate:down

DROP TABLE solana_intermediate_winners;
