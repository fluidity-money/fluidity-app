--migrate:up

ALTER TABLE lootbox_counts_return
    ALTER COLUMN tier1 TYPE NUMERIC,
    ALTER COLUMN tier2 TYPE NUMERIC,
    ALTER COLUMN tier3 TYPE NUMERIC,
    ALTER COLUMN tier4 TYPE NUMERIC,
    ALTER COLUMN tier5 TYPE NUMERIC;

-- update return to be numeric
CREATE OR REPLACE FUNCTION lootbox_counts()
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

--migrate:down

ALTER TABLE lootbox_counts_return
    ALTER COLUMN tier1 TYPE INT,
    ALTER COLUMN tier2 TYPE INT,
    ALTER COLUMN tier3 TYPE INT,
    ALTER COLUMN tier4 TYPE INT,
    ALTER COLUMN tier5 TYPE INT;

-- return to original definition
CREATE OR REPLACE FUNCTION lootbox_counts()
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
    GROUP BY
        address,
        reward_tier
    ORDER BY 1',
    'VALUES (1),(2),(3),(4),(5)'
) AS ct(
    address VARCHAR,
    tier1 INT,
    tier2 INT,
    tier3 INT,
    tier4 INT,
    tier5 INT
);
$$;
