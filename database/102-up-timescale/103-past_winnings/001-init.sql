-- migrate:up

-- high level representation of past winners aggregated per day per month

CREATE TABLE past_winnings (
	winning_date DATE NOT NULL,
	amount_of_winners uint256 NOT NULL,
	winning_amount uint256 NOT NULL
);

-- migrate:down

DROP TABLE IF EXISTS past_winnings;

