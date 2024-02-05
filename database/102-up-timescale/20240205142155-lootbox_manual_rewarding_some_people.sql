
-- migrate:up

ALTER TYPE lootbox_source ADD VALUE 'manual_reward';

INSERT INTO lootbox (address, source, transaction_hash, referrer, awarded_time, volume, reward_tier, lootbox_count, application, epoch) VALUES
	-- okay users
	('0x502254A79791C612aF08D49d68449aF38266f8dC', 'manual_reward', '', '', '2024-02-05 05:47:01.146448+00', 0, 3, 10, 'none', 'epoch_2'),
	('0x896c882e4c37132dc63fe442b1305f70a68f7cf7', 'manual_reward', '', '', '2024-02-05 05:47:01.146448+00', 0, 3, 10, 'none', 'epoch_2'),
	('0xe1ab77fa0c089dd578fa1e542e50d655a37c3b05', 'manual_reward', '', '', '2024-02-05 05:47:01.146448+00', 0, 3, 10, 'none', 'epoch_2'),
	('0xb59e6d31dd9d2c38b5b1bbfe019be46800b917bf', 'manual_reward', '', '', '2024-02-05 05:47:01.146448+00', 0, 3, 10, 'none', 'epoch_2'),
	('0x9de6107df383c348b18582b1a2e355491bbc1b5d', 'manual_reward', '', '', '2024-02-05 05:47:01.146448+00', 0, 3, 10, 'none', 'epoch_2'),
	-- nice user
	('0x7a6f38594496617f61f8358912f4ea69fe33d02f', 'manual_reward', '', '', '2024-02-05 05:47:01.146448+00', 0, 4, 5, 'none', 'epoch_2'),
	-- testnet redemption bottles
	('0xfae62c9056f9e9c3cf555311ade26a2eab01a8e3', 'manual_reward', '', '', '2024-02-05 05:47:01.146448+00', 0, 3, 10, 'none', 'epoch_2');

-- migrate:down

DELETE FROM lootbox WHERE
	(address = '0x502254a79791c612af08d49d68449af38266f8dc' AND source = 'manual_reward' AND awarded_time = '2024-02-05 05:47:01.146448+00') OR
	(address = '0x896c882e4c37132dc63fe442b1305f70a68f7cf7' AND source = 'manual_reward' AND awarded_time = '2024-02-05 05:47:01.146448+00') OR
	(address = '0xe1ab77fa0c089dd578fa1e542e50d655a37c3b05' AND source = 'manual_reward' AND awarded_time = '2024-02-05 05:47:01.146448+00') OR
	(address = '0xb59e6d31dd9d2c38b5b1bbfe019be46800b917bf' AND source = 'manual_reward' AND awarded_time = '2024-02-05 05:47:01.146448+00') OR
	(address = '0x9de6107df383c348b18582b1a2e355491bbc1b5d' AND source = 'manual_reward' AND awarded_time = '2024-02-05 05:47:01.146448+00') OR
	(address = '0x7a6f38594496617f61f8358912f4ea69fe33d02f' AND source = 'manual_reward' AND awarded_time = '2024-02-05 05:47:01.146448+00') OR
	(address = '0xfae62c9056f9e9c3cf555311ade26a2eab01a8e3' AND source = 'manual_reward' AND awarded_time = '2024-02-05 05:47:01.146448+00');
