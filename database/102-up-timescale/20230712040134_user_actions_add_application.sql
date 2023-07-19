-- migrate:up
ALTER TABLE user_actions 
  ADD COLUMN application VARCHAR NOT NULL DEFAULT 'none' ;

-- migrate:down

ALTER TABLE user_actions
  DROP COLUMN application;

