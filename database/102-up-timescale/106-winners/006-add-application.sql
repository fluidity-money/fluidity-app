-- migrate:up

-- must mirror the `String()` method of lib/types/applications/applications.go
CREATE TYPE ethereum_application AS ENUM (
    'none',
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

-- must mirror the `String()` method of common/solana/applications/applications.go
CREATE TYPE solana_application AS ENUM (
    'spl',
    'saber',
    'orca',
    'raydium',
    'aldrinv1',
    'aldrinv2',
    'lifinity',
    'mercurial'
);

ALTER TABLE winners
	ADD COLUMN ethereum_application ethereum_application,
	ADD COLUMN solana_application solana_application;

-- migrate:down

ALTER TABLE winners
	DROP COLUMN ethereum_application,
	DROP COLUMN solana_application;	

DROP TYPE ethereum_application;
DROP TYPE solana_application;

