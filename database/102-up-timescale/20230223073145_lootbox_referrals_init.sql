-- migrate:up

CREATE TABLE lootbox_referrals (
  address_1 VARCHAR,
  address_2 VARCHAR,
  PRIMARY KEY (address_1, address_2)
);


-- migrate:down

DROP TABLE lootbox_referrals;

