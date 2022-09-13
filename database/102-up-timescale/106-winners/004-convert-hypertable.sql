-- migrate:up

SELECT create_hypertable('winners', 'awarded_time', if_not_exists => TRUE, migrate_data => TRUE);

-- migrate:down

-- duplicate data, delete hypertable, move back as regular table
CREATE TABLE winners_ (LIKE winners INCLUDING ALL);
INSERT INTO winners_ (SELECT * FROM winners);
DROP TABLE winners;
ALTER TABLE winners_ RENAME TO winners;
