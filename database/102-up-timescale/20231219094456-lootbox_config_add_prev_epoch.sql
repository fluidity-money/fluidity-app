
-- migrate:up

CREATE TABLE lootbox_config (
	-- is_current_program if enabled, it's assumed that this is
	-- the current epoch routine, and config is derived from this
	is_current_program BOOLEAN NOT NULL DEFAULT FALSE,

	-- program_begin_date to begin counting lootbottles from
	-- this date onwards, in UTC
	program_begin TIMESTAMP,

	-- program_end to use as the final date for the epoch, and
	-- when to stop counting (also in UTC)
	program_end TIMESTAMP,

	-- epoch_identifier to use as the identifier for the epoch with
	-- the enum
	epoch_identifier lootbox_epoch NOT NULL UNIQUE,

	-- ethereum_application that should be the current focus of the lootbox
	-- mini leaderboard competitions (and should be displayed in the UI
	-- with the right query)
	ethereum_application ethereum_application NOT NULL DEFAULT 'none'
);

INSERT INTO lootbox_config (
	program_begin,
	program_end,
	epoch_identifier
) VALUES (
	'2023-05-01 12:00:00+02',
	'2023-06-28 12:00:00+02',
	'epoch_1'
);

-- migrate:down

DROP TABLE lootbox_config;
