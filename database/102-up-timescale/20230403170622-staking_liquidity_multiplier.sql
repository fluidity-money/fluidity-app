-- migrate:up
-- calculate a single liquidity multiplier based on days elapsed for a given row of the staking_events table
CREATE FUNCTION staking_liquidity_multiplier(staking_row staking_events, days_elapsed INT)
RETURNS SETOF liquidity_result
LANGUAGE SQL
STABLE
AS
$$
-- cap at 1
SELECT LEAST(1, (((396.0 / 11315) - ((396.0 / 4129975) * staking_row.lockup_length)) * days_elapsed) + ((396.0 * staking_row.lockup_length) / 133225) - (31.0 / 365)) AS result
$$;

--migrate:down

DROP FUNCTION staking_liquidity_multiplier;
