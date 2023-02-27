-- migrate:up

CREATE TABLE lootbox_referrals (
  referrer VARCHAR,
  referee VARCHAR,
  PRIMARY KEY (referrer, referee)
);


-- migrate:down

DROP TABLE lootbox_referrals;

