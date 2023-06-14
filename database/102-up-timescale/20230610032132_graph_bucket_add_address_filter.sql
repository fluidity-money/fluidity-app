-- migrate:up
-- feat - 20230606153015-graph_bucket add nullable address filter

DROP FUNCTION graph_bucket;

CREATE FUNCTION graph_bucket (network_ network_blockchain, interval_ interval, limit_ int, address TEXT DEFAULT null)
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
        AND (address IS null OR sender_address = address OR recipient_address = address)
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

