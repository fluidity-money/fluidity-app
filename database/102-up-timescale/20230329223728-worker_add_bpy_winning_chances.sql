
-- migrate:up

ALTER TABLE worker_emissions
	ADD COLUMN winning_chances_total_bpy DOUBLE PRECISION NOT NULL DEFAULT 0,
	ADD COLUMN winning_chances_distribution_pools DOUBLE PRECISION NOT NULL DEFAULT 0;

-- migrate:down

ALTER TABLE worker_emissions
	DROP COLUMN winning_chances_total_bpy,
	DROP COLUMN winning_chances_distribution_pools;
