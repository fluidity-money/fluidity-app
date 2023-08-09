-- migrate:up
CREATE TABLE reward_epoch_application (
  -- epoch_id FK to reward_epoch
  epoch_id INT NOT NULL,

  application ethereum_application,

  PRIMARY KEY(epoch_id, application),

  CONSTRAINT fk_epoch_id
  FOREIGN KEY(epoch_id)
  REFERENCES reward_epoch(epoch_id)
  ON DELETE CASCADE
);

-- migrate:down

DROP TABLE reward_epoch_application;
