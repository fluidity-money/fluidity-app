-- migrate:up

SELECT create_hypertable('worker_buffered_atx', 'block_number', chunk_time_interval => 86400, if_not_exists => TRUE, migrate_data => TRUE);

-- migrate:down

-- duplicate data, delete hypertable, move back as regular table

CREATE TABLE worker_buffered_atx_ (LIKE worker_buffered_atx INCLUDING ALL);
INSERT INTO worker_buffered_atx_ (SELECT * FROM worker_buffered_atx);
DROP TABLE worker_buffered_atx;
ALTER TABLE worker_buffered_atx_ RENAME TO worker_buffered_atx;
