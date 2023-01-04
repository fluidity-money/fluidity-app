-- migrate:up

CREATE TYPE website_source AS ENUM (
	'landing',
	'faucet'
);

ALTER TABLE website_questions
	ADD COLUMN source website_source NOT NULL;

-- migrate:down

ALTER TABLE website_questions
	DROP COLUMN source;

DROP TYPE website_source;
