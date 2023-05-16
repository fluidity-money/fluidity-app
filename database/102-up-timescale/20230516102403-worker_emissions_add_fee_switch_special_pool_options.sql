-- migrate:up

-- fee switch emissions

ALTER TABLE worker_emissions
	ADD COLUMN fee_switch_sender_original_address VARCHAR,
	ADD COLUMN fee_switch_sender_new_address VARCHAR,
	ADD COLUMN fee_switch_recipient_original_address VARCHAR,
	ADD COLUMN fee_switch_recipient_new_address VARCHAR;

-- special pool options (utility mining)

ALTER TABLE worker_emissions
	ADD COLUMN special_pool_options_payout_freq_override DOUBLE PRECISION,
	ADD COLUMN special_pool_options_delta_weight_override DOUBLE PRECISION,
	ADD COLUMN special_pool_options_winning_classes_override DOUBLE PRECISION;

-- migrate:down

ALTER TABLE worker_emissions
	DROP COLUMN fee_switch_sender_original_address,
	DROP COLUMN fee_switch_sender_new_address,
	DROP COLUMN fee_switch_recipient_original_address VARCHAR,
	DROP COLUMN fee_switch_recipient_new_address VARCHAR,
	DROP COLUMN special_pool_options_payout_freq_override,
	DROP COLUMN special_pool_options_delta_weight_override,
	DROP COLUMN special_pool_options_winning_classes_override;
