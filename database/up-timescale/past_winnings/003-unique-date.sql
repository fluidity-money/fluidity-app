-- migrate:up

-- make the winning_date unique so as to prevent mistakes happening on the
-- cronjob that's responsible for this with weird timing

ALTER TABLE past_winnings
	ADD CONSTRAINT winning_date_unique UNIQUE (winning_date, network);

-- migrate:down

ALTER TABLE past_winnings
    DROP CONSTRAINT IF EXISTS winning_date_unique;