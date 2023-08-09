-- migrate:up
CREATE TABLE reward_epoch (
  -- epoch_id automatically counts epoch number
  epoch_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

  -- start timestamp of epoch
  start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- end timestamp of epoch
  end_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- migrate:down

DROP TABLE reward_epoch;

