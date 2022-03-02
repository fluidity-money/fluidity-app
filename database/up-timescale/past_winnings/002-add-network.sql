
-- add the network identifier

ALTER TABLE past_winnings
	ADD COLUMN network network_blockchain NOT NULL;
