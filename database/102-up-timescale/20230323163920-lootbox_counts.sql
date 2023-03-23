--migrate:up

CREATE TABLE lootbox_counts_return(
	address VARCHAR,
	tier1 INT,
	tier2 INT,
	tier3 INT,
	tier4 INT,
	tier5 INT
);

-- returns the total boxes in each tier for each address 
CREATE FUNCTION lootbox_counts()
RETURNS SETOF lootbox_counts_return
LANGUAGE SQL
STABLE
AS
$$
SELECT address, tier1, tier2, tier3, tier4, tier5
FROM crosstab(
    'SELECT address, reward_tier, SUM(lootbox_count)
    FROM lootbox
    GROUP BY
        address,
        reward_tier
    ORDER BY 1',
    $$VALUES(1),(2),(3),(4),(5)$$
) AS ct(
    address VARCHAR,
    tier1 INT,
    tier2 INT,
    tier3 INT,
    tier4 INT,
    tier5 INT
);
$$;

--migrate:down

DROP FUNCTION lootbox_counts;
DROP TABLE lootbox_counts_return;
