-- migrate:up

-- must mirror the `String()` method of common/sui/applications/applications.go
CREATE TYPE sui_application AS ENUM (
    'none'
);

ALTER TABLE winners
	ADD COLUMN sui_application sui_application;

-- migrate:down

ALTER TABLE winners
	DROP COLUMN sui_application;

DROP TYPE sui_application;
