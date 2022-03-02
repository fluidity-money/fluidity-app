-- tvl records the total value locked in the contract

CREATE TABLE tvl (
    -- total value locked, in the contract's units
    tvl UINT256 NOT NULL,

    contract_address VARCHAR NOT NULL,

    network network_blockchain NOT NULL,

    -- time this tvl was recorded
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
