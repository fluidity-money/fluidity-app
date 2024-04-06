-- migrate:up

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
	format(
		'SELECT
		address,
		reward_tier,
		SUM(lootbox_count)
		FROM lootbox
		WHERE source=''referral'' AND epoch = %s
		GROUP BY
			address,
			reward_tier
		ORDER BY 1',
		quote_literal(epoch_)
	),
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
	format(
		'SELECT
		address,
		reward_tier,
		SUM(new_count)
		FROM lootbox
		WHERE source=''referral'' AND epoch = %s
		GROUP BY
			address,
			reward_tier
		ORDER BY 1',
		quote_literal(epoch_)
	),
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
