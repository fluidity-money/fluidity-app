-- migrate:up

-- add support for taking signups

CREATE TABLE website_subscriptions (
	primary_key BIGSERIAL PRIMARY KEY,

	-- email used to sign up with a subscription

	email VARCHAR NOT NULL,

	-- source that the user used to submit a subscription

	source website_source NOT NULL
);

-- migrate:down

DROP TABLE IF EXISTS website_subscriptions;
