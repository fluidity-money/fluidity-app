
-- migrate:up

-- analytics is a simple table for rendering collected analytics derived
-- from user actions that the frontend can render (ie, total volume)

CREATE TABLE analytics (
	updated TIMESTAMP NOT NULL,
	total_volume DOUBLE PRECISION NOT NULL
);

-- migrate:down

DROP INDEX analytics_updated;
