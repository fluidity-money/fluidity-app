-- migrate:up

-- must mirror the `String()` method of lib/types/applications/applications.go
CREATE TYPE application AS ENUM (
    'uniswap_v2',
    'balancer_v2',
    'oneinch_v2',
    'oneinch_v1',
    'mooniswap',
    'oneinch_fixedrate',
    'dodo_v2',
    'curve',
    'multichain',
    'xy_finance'
);

ALTER TABLE winners
	ADD COLUMN application application;

-- migrate:down

ALTER TABLE winners
	DROP COLUMN application;	

DROP TYPE application;

