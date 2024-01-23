
-- migrate:up

ALTER TABLE lootbox_referral_codes DROP COLUMN epoch;

ALTER TABLE lootbox_referrals DROP COLUMN epoch;

-- migrate:down

ALTER TABLE lootbox_referral_codes
	ADD COLUMN epoch lootbox_epoch NOT NULL DEFAULT 'epoch_1';

ALTER TABLE lootbox_referrals
	ADD COLUMN epoch lootbox_epoch NOT NULL DEFAULT 'epoch_1';
