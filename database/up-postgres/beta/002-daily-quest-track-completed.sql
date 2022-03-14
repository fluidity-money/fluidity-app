-- migrate:up

ALTER TABLE beta_user
	ADD daily_quest_1_completed BOOLEAN NOT NULL,
	ADD daily_quest_2_completed BOOLEAN NOT NULL,
	ADD daily_quest_3_completed BOOLEAN NOT NULL,
	ADD daily_quest_4_completed BOOLEAN NOT NULL,
	ADD daily_quest_5_completed BOOLEAN NOT NULL,
	ADD daily_quest_6_completed BOOLEAN NOT NULL;

-- migrate:down
ALTER TABLE beta_user
    DROP COLUMN IF EXISTS daily_quest_1_completed,
    DROP COLUMN IF EXISTS daily_quest_2_completed,
    DROP COLUMN IF EXISTS daily_quest_3_completed,
    DROP COLUMN IF EXISTS daily_quest_4_completed,
    DROP COLUMN IF EXISTS daily_quest_5_completed,
    DROP COLUMN IF EXISTS daily_quest_6_completed;
