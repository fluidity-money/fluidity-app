-- migrate:up
CREATE TABLE lootbox_referral_codes (
  referral_code VARCHAR PRIMARY KEY,
  address VARCHAR NOT NULL UNIQUE
);

-- migrate:down
DROP TABLE lootbox_referral_codes;

