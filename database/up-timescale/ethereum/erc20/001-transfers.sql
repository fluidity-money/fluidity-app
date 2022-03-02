
CREATE TABLE ethereum_erc20_transfers (
	contract_address VARCHAR NOT NULL,
	from_address VARCHAR NOT NULL,
	to_address VARCHAR NOT NULL,
	amount uint256 NOT NULL,
	picked_up TIMESTAMP NOT NULL,
	transaction_hash VARCHAR NOT NULL
);
