-- migrate:up

-- user action taken by the user

CREATE TYPE user_action AS ENUM (
	'swap',
	'send'
);

-- migrate:down

DROP TYPE user_action;

