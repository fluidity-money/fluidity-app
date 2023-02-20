CREATE TABLE asset (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    symbol VARCHAR(255) NOT NULL,
    logo VARCHAR(255) NOT NULL,
    decimals INTEGER NOT NULL,
    type VARCHAR(255) NOT NULL,
    contract_address VARCHAR(255) NOT NULL,
    is_fluid BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_asset_modtime
BEFORE UPDATE ON asset
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();
