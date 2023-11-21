-- migrate:up

ALTER TABLE worker_emissions
	ADD COLUMN fee_switch_sender_reason VARCHAR,
	ADD COLUMN fee_switch_recipient_reason VARCHAR;

-- migrate:down

ALTER TABLE worker_emissions
	DROP COLUMN fee_switch_sender_reason,
	DROP COLUMN fee_switch_recipient_reason;
