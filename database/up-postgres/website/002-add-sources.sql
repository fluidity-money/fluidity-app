
CREATE TYPE website_source AS ENUM (
	'landing',
	'faucet'
);

ALTER TABLE website_questions
	ADD COLUMN source website_source NOT NULL;
