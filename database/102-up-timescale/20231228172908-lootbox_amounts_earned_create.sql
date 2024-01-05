-- migrate:up

-- lootbox_amounts_rewarded is an accumulation table that increases
-- itself over time on a per-epoch basis. it does so so we can track
-- cleanly in the UI the amounts earned for the lootbox presentation

-- the recipient field is converted from the solana winner owner
-- address implicitly in the go code currently!

-- we're okay with DECIMAL as we can store the floating amount with a
-- level of loss since this is user-facing.

CREATE TABLE lootbox_amounts_rewarded (
	network network_blockchain NOT NULL,
	epoch lootbox_epoch NOT NULL,
	token_short_name VARCHAR NOT NULL,

	-- the amount earned, normalised according to the underlying
	-- decimals. can be lossy
	amount_earned DECIMAL NOT NULL,

	-- recipient of the winning amount (the winner)
	recipient VARCHAR NOT NULL,

	application VARCHAR NOT NULL,
	last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

	-- id to prevent duplication during the upsert for updating amounts
	CONSTRAINT id PRIMARY KEY(network, epoch, token_short_name, recipient, application)
);

-- migrate:down

DROP TABLE lootbox_amounts_rewarded;
