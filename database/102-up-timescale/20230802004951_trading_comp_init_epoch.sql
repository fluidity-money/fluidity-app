-- migrate:up
CREATE TABLE reward_epoch (
  -- id automatically counts epoch number
  id SERIAL NOT NULL,

  -- start timestamp of epoch
  start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- end timestamp of epoch
  end TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- application to be filtered for. Can be "none" (For Fluidity) or NULL (For All)
  application ethereum_application
);


-- migrate:down

DROP TABLE reward_epoch;

