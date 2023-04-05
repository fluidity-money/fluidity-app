-- migrate:up

CREATE FUNCTION protocol_multiplier(application ethereum_application)
RETURNS NUMERIC
LANGUAGE SQL
STABLE
AS
$$
SELECT 
    CASE 
        WHEN application = 'uniswap_v2' THEN 2
        WHEN application = 'uniswap_v3' THEN 2
        WHEN application = 'saddle' THEN 2
        WHEN application = 'curve' THEN 2
        ELSE 1.0/3
    END
$$;


CREATE TABLE liquidity_result (
	result NUMERIC
);

-- calculate a single liquidity multiplier based on days elapsed of a total stake duration
CREATE FUNCTION calculate_liquidity_multiplier(total_days INT, days_elapsed INT)
RETURNS SETOF liquidity_result
LANGUAGE SQL
STABLE
AS
$$
-- cap at 1
SELECT LEAST(1, (((396.0 / 11315) - ((396.0 / 4129975) * total_days)) * days_elapsed) + ((396.0 * total_days) / 133225) - (31.0 / 365)) AS result
$$;

-- a user's total liquidity multiplier at time `instant`, obtained by summing the multipliers of all their staking events
-- returns as SETOF to be exposed by hasura
CREATE FUNCTION calculate_a_y(address_ VARCHAR, instant TIMESTAMP)
RETURNS SETOF liquidity_result
LANGUAGE SQL
STABLE
AS
$$
-- a1y1 + a2y2 + .. + anyn
SELECT 
SUM(
    usd_amount * liquidity.result
) AS result
FROM staking_events,
LATERAL calculate_liquidity_multiplier(
        lockup_length, 
        EXTRACT(DAY 
            FROM instant - inserted_date
        )::INT
    ) AS liquidity
WHERE address = address_;
$$;

--migrate:down

DROP FUNCTION calculate_liquidity_multiplier;
DROP TABLE liquidity_result;
DROP FUNCTION protocol_multiplier;
