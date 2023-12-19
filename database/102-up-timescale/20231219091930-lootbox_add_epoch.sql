
-- migrate:up

CREATE TYPE lootbox_epoch AS ENUM (
	'epoch_1',
	'epoch_2',
	'epoch_testing'
);

ALTER TABLE lootbox
	ADD COLUMN epoch lootbox_epoch NOT NULL DEFAULT 'epoch_1';

ALTER TABLE lootbox_referral_codes
	ADD COLUMN epoch lootbox_epoch NOT NULL DEFAULT 'epoch_1';

ALTER TABLE lootbox_referrals
	ADD COLUMN epoch lootbox_epoch NOT NULL DEFAULT 'epoch_1';

DROP FUNCTION lootbox_referral_lootbottle_counts;

CREATE FUNCTION lootbox_referral_lootbottle_counts(epoch_ lootbox_epoch)
RETURNS SETOF lootbox_counts_return
LANGUAGE SQL
STABLE
AS
$$
SELECT
    address,
    COALESCE(tier1, 0),
    COALESCE(tier2, 0),
    COALESCE(tier3, 0),
    COALESCE(tier4, 0),
    COALESCE(tier5, 0)
FROM crosstab(
    'SELECT
	address,
	reward_tier,
	SUM(lootbox_count)
    FROM lootbox
    WHERE source=''referral'' AND epoch = epoch_
    GROUP BY
        address,
        reward_tier
    ORDER BY 1',
    'VALUES (1),(2),(3),(4),(5)'
) AS ct(
    address VARCHAR,
    tier1 NUMERIC,
    tier2 NUMERIC,
    tier3 NUMERIC,
    tier4 NUMERIC,
    tier5 NUMERIC
);
$$;

-- migrate:down

ALTER TABLE lootbox DROP COLUMN epoch;

ALTER TABLE lootbox_referral_codes DROP COLUMN epoch;

ALTER TABLE lootbox_referrals DROP COLUMN epoch;

DROP FUNCTION lootbox_referral_lootbottle_counts;

CREATE FUNCTION lootbox_referral_lootbottle_counts()
RETURNS SETOF lootbox_counts_return
LANGUAGE SQL
STABLE
AS
$$
SELECT
    address,
    COALESCE(tier1, 0),
    COALESCE(tier2, 0),
    COALESCE(tier3, 0),
    COALESCE(tier4, 0),
    COALESCE(tier5, 0)
FROM crosstab(
    'SELECT
	address,
	reward_tier,
	SUM(lootbox_count)
    FROM lootbox
    WHERE source=''referral''
    GROUP BY
        address,
        reward_tier
    ORDER BY 1',
    'VALUES (1),(2),(3),(4),(5)'
) AS ct(
    address VARCHAR,
    tier1 NUMERIC,
    tier2 NUMERIC,
    tier3 NUMERIC,
    tier4 NUMERIC,
    tier5 NUMERIC
);
$$;
