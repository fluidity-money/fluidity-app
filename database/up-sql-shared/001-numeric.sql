-- migrate:up

-- reusable datatypes across the postgres/timescale relations
-- since the backend's the same.

CREATE DOMAIN uint256 NUMERIC(78, 0);

-- migrate:down

DROP DOMAIN IF EXISTS uint256;