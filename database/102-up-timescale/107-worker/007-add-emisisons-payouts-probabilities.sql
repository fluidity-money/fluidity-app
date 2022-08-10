-- migrate:up

ALTER TABLE worker_emissions
	ADD COLUMN payout_1 DOUBLE PRECISION NOT NULL DEFAULT 0,
	ADD COLUMN payout_2 DOUBLE PRECISION NOT NULL DEFAULT 0,
	ADD COLUMN payout_3 DOUBLE PRECISION NOT NULL DEFAULT 0,
	ADD COLUMN payout_4 DOUBLE PRECISION NOT NULL DEFAULT 0,
	ADD COLUMN payout_5 DOUBLE PRECISION NOT NULL DEFAULT 0,

	ADD COLUMN probability_1 DOUBLE PRECISION NOT NULL DEFAULT 0,
	ADD COLUMN probability_2 DOUBLE PRECISION NOT NULL DEFAULT 0,
	ADD COLUMN probability_3 DOUBLE PRECISION NOT NULL DEFAULT 0,
	ADD COLUMN probability_4 DOUBLE PRECISION NOT NULL DEFAULT 0,
	ADD COLUMN probability_5 DOUBLE PRECISION NOT NULL DEFAULT 0;

-- migrate:down

ALTER TABLE worker_emissions
	DROP COLUMN payout_1,
	DROP COLUMN payout_2,
	DROP COLUMN payout_3,
	DROP COLUMN payout_4,
	DROP COLUMN payout_5,

	DROP COLUMN probability_1,
	DROP COLUMN probability_2,
	DROP COLUMN probability_3,
	DROP COLUMN probability_4,
	DROP COLUMN probability_5;

