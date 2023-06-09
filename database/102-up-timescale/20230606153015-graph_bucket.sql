-- migrate:up
CREATE TABLE graph_bucket_return (
    sender_address varchar,
    bucket timestamp,
    amount double precision,
    time timestamp
);

-- to aggregate the highest volume action per interval for the webapp graph
CREATE FUNCTION graph_bucket (network_ network_blockchain, interval_ interval, limit_ int)
RETURNS SETOF graph_bucket_return
LANGUAGE sql
STABLE
AS $function$
SELECT
    *
FROM ( SELECT DISTINCT ON (bucket)
        sender_address,
        time_bucket (interval_, time) AS bucket,
        GREATEST(MAX(amount / 10 ^ token_decimals), MAX(amount_str::numeric / 10 ^ token_decimals)) AS amount,
        time
    FROM
        user_actions
    WHERE
        network = network_
    GROUP BY
        bucket,
        sender_address,
        time
    ORDER BY
        bucket DESC,
        amount DESC
    LIMIT limit_
) ua
ORDER BY bucket ASC;
$function$;

-- migrate:down

DROP FUNCTION graph_bucket;
DROP TABLE graph_bucket_return;
