
-- migrate:up

ALTER TABLE worker_emissions
	ALTER COLUMN winning_chances_distribution_pools TYPE VARCHAR;

-- migrate:down

ALTER TABLE worker_emissions
	ALTER COLUMN winning_chances_distribution_pools TYPE DOUBLE PRECISION;
