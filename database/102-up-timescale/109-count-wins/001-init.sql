-- migrate:up

CREATE OR REPLACE PROCEDURE count_wins(job_id int, config jsonb) LANGUAGE PLPGSQL AS
$$
BEGIN
    INSERT INTO past_winnings (
	network,
	winning_date,
	amount_of_winners,
	winning_amount
    ) 
    SELECT 
	network, 
	date_trunc('day', NOW()) - INTERVAL '1 DAY',
	COUNT(1), 
	SUM(winning_amount / (10 ^ token_decimals)) 
    FROM
	winners 
    WHERE 
	awarded_time 
	BETWEEN
	    (DATE_TRUNC('day', NOW()) - INTERVAL '1 DAY') 
	AND 
	    DATE_TRUNC('day', NOW()) 
    GROUP BY network;
	
	-- ensure schedule is exactly 24 hours later, so we don't drift
	-- https://github.com/timescale/timescaledb/issues/2966
	PERFORM alter_job(job_id, next_start => DATE_TRUNC('day', NOW()) + INTERVAL '1 DAY');
END
$$;

-- run job at midnight each day
SELECT add_job('count_wins', '1d', '{}', now() + interval '1 DAY');

-- migrate:down

-- https://dba.stackexchange.com/a/97967
SELECT f.* 
FROM timescaledb_information.jobs jobs, delete_job(jobs.job_id) f 
WHERE jobs.proc_name = 'count_wins';
