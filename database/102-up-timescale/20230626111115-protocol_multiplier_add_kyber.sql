-- migrate:up

CREATE OR REPLACE FUNCTION protocol_multiplier(application ethereum_application)
RETURNS NUMERIC
LANGUAGE SQL
STABLE
AS
$$
SELECT 
    CASE 
        WHEN application = 'curve' THEN 2
        WHEN application = 'saddle' THEN 2
        WHEN application = 'sushiswap' THEN 2
        WHEN application = 'uniswap_v2' THEN 2
        WHEN application = 'uniswap_v3' THEN 2
        WHEN application = 'kyber_classic' THEN 2
        ELSE 1.0/3
    END
$$;

-- migrate:down

CREATE OR REPLACE FUNCTION protocol_multiplier(application ethereum_application)
RETURNS NUMERIC
LANGUAGE SQL
STABLE
AS
$$
SELECT 
    CASE 
        WHEN application = 'curve' THEN 2
        WHEN application = 'saddle' THEN 2
        WHEN application = 'sushiswap' THEN 2
        WHEN application = 'uniswap_v2' THEN 2
        WHEN application = 'uniswap_v3' THEN 2
        ELSE 1.0/3
    END
$$;
