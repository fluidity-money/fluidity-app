-- migrate:up

CREATE TYPE website_source AS ENUM (
	'landing',
	'faucet'
);

ALTER TABLE website_questions
	ADD COLUMN source website_source NOT NULL;

-- migrate:down

DROP TYPE IF EXISTS website_source;

ALTER TABLE website_questions 
    DROP COLUMN IF EXISTS source;