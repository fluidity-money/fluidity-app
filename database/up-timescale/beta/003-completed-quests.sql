-- migrate:up

-- completed beta quests, a write-only log of the quests that users have
-- finished

CREATE TABLE beta_completed_quests (

	-- the user's user id, stored in a separate table in
	-- postgres. (beta_user.user_id).

	beta_user_user_id VARCHAR NOT NULL,

	recipient_address VARCHAR NOT NULL,

	time TIMESTAMP NOT NULL
);

-- migrate:down

DROP TABLE beta_completed_quests;
