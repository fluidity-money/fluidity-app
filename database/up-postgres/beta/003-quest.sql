-- migrate:up

-- a list of quests that can be assigned to users to complete in the beta

CREATE TABLE quests (

    primary_key BIGSERIAL PRIMARY KEY NOT NULL,

    -- address is the address of the quest contract

    address VARCHAR UNIQUE NOT NULL
);

-- migrate:down
DROP TABLE IF EXISTS quests;
