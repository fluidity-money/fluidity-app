-- migrate:up

ALTER TYPE network_blockchain ADD VALUE 'arbitrum';

-- migrate:down

-- there's no good way to remove enum variants
