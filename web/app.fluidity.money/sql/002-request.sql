
DROP TABLE IF EXISTS request;
CREATE request (
    id SERIAL PRIMARY KEY,
    asset_id INTEGER NOT NULL references asset(id),
    amount NUMERIC(65,30) NOT NULL,
    sender VARCHAR(255) NOT NULL,
    receiver VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE OR UPDATE TRIGGER update_request_modtime
BEFORE UPDATE ON request
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();