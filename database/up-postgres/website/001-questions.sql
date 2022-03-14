-- migrate:up

-- questions received by faucet.fluidity.money

CREATE TABLE website_questions (
	primary_key BIGSERIAL PRIMARY KEY,

	-- name is the name of the question submitter

	name VARCHAR NOT NULL,

	-- email is the email of the question submitter

	email VARCHAR NOT NULL,

	-- question is the question content that they submitted

	question CHAR(500) NOT NULL
);

-- migrate:down

DROP TABLE IF EXISTS website_questions;