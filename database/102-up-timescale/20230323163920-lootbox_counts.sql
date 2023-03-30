--migrate:up

-- enable tablefunc to use crosstab
CREATE EXTENSION tablefunc;

CREATE TABLE lootbox_counts_return(
	address VARCHAR NOT NULL,
	tier1 INT NOT NULL,
	tier2 INT NOT NULL,
	tier3 INT NOT NULL,
	tier4 INT NOT NULL,
	tier5 INT NOT NULL  
);

-- returns the total boxes in each tier for each address 
CREATE FUNCTION lootbox_counts()
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

--migrate:down

DROP FUNCTION lootbox_counts;
DROP TABLE lootbox_counts_return;
DROP EXTENSION tablefunc;
