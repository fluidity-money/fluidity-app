
-- migrate:up

UPDATE worker_emissions SET naive_is_winning_testing_balls = NULL;

ALTER TABLE worker_emissions
	ALTER COLUMN naive_is_winning_testing_balls TYPE VARCHAR;

-- migrate:down

UPDATE worker_emissions SET naive_is_winning_testing_balls = NULL;

ALTER TABLE worker_emissions
	ALTER COLUMN naive_is_winning_testing_balls 
		TYPE BIGINT[] 
		USING CAST (naive_is_winning_testing_balls AS bigint[]);
