
-- migrate:up

INSERT INTO lootbox (
	address,
	source,
	awarded_time,
	volume,
	reward_tier,
	lootbox_count,
	application,
	epoch
)

VALUES
	('0x75964ac8cc1676eb51451f25faaaefd40ccde602', 'airdrop', timezone('utc', now()), 0, 1, 100, 'none', 'epoch_2'),
	('0x75964ac8cc1676eb51451f25faaaefd40ccde602', 'airdrop', timezone('utc', now()), 0, 2, 50, 'none', 'epoch_2'),
	('0x75964ac8cc1676eb51451f25faaaefd40ccde602', 'airdrop', timezone('utc', now()), 0, 3, 10, 'none', 'epoch_2'),
	('0x75964ac8cc1676eb51451f25faaaefd40ccde602', 'airdrop', timezone('utc', now()), 0, 4, 1, 'none', 'epoch_2'),
	('0xd1d13003128cb454ff562850f86413498c1ebedf', 'airdrop', timezone('utc', now()), 0, 1, 100, 'none', 'epoch_2'),
	('0xd1d13003128cb454ff562850f86413498c1ebedf', 'airdrop', timezone('utc', now()), 0, 2, 50, 'none', 'epoch_2'),
	('0xd1d13003128cb454ff562850f86413498c1ebedf', 'airdrop', timezone('utc', now()), 0, 3, 10, 'none', 'epoch_2'),
	('0x8cb42fe548bb51ca4125eac3c14cf177b2b183d8', 'airdrop', timezone('utc', now()), 0, 1, 100, 'none', 'epoch_2'),
	('0x8cb42fe548bb51ca4125eac3c14cf177b2b183d8', 'airdrop', timezone('utc', now()), 0, 2, 50, 'none', 'epoch_2'),
	('0x8cb42fe548bb51ca4125eac3c14cf177b2b183d8', 'airdrop', timezone('utc', now()), 0, 3, 10, 'none', 'epoch_2'),
	('0xb363335ff6e0a91f870c200bf6fcb38d1fd0f346', 'airdrop', timezone('utc', now()), 0, 1, 100, 'none', 'epoch_2'),
	('0xb363335ff6e0a91f870c200bf6fcb38d1fd0f346', 'airdrop', timezone('utc', now()), 0, 2, 50, 'none', 'epoch_2'),
	('0xb363335ff6e0a91f870c200bf6fcb38d1fd0f346', 'airdrop', timezone('utc', now()), 0, 3, 10, 'none', 'epoch_2'),
	('0x2d0eb64ffc36339a15c531b64fd55404ca7f8f62', 'airdrop', timezone('utc', now()), 0, 1, 100, 'none', 'epoch_2'),
	('0x2d0eb64ffc36339a15c531b64fd55404ca7f8f62', 'airdrop', timezone('utc', now()), 0, 2, 50, 'none', 'epoch_2'),
	('0x2d0eb64ffc36339a15c531b64fd55404ca7f8f62', 'airdrop', timezone('utc', now()), 0, 3, 10, 'none', 'epoch_2'),
	('0x32f5de0d8f24094c660979ae34772985a1a8c831', 'airdrop', timezone('utc', now()), 0, 1, 100, 'none', 'epoch_2'),
	('0x32f5de0d8f24094c660979ae34772985a1a8c831', 'airdrop', timezone('utc', now()), 0, 2, 50, 'none', 'epoch_2'),
	('0x32f5de0d8f24094c660979ae34772985a1a8c831', 'airdrop', timezone('utc', now()), 0, 3, 10, 'none', 'epoch_2'),
	('0x2da7958dc2a33e7720935102107f0886e8ab6574', 'airdrop', timezone('utc', now()), 0, 1, 100, 'none', 'epoch_2'),
	('0x2da7958dc2a33e7720935102107f0886e8ab6574', 'airdrop', timezone('utc', now()), 0, 2, 50, 'none', 'epoch_2'),
	('0x2da7958dc2a33e7720935102107f0886e8ab6574', 'airdrop', timezone('utc', now()), 0, 3, 10, 'none', 'epoch_2'),
	('0xf6352e3a8e502b93af36821cc6f45d6f37ac4aed', 'airdrop', timezone('utc', now()), 0, 1, 100, 'none', 'epoch_2'),
	('0xf6352e3a8e502b93af36821cc6f45d6f37ac4aed', 'airdrop', timezone('utc', now()), 0, 2, 50, 'none', 'epoch_2'),
	('0xf6352e3a8e502b93af36821cc6f45d6f37ac4aed', 'airdrop', timezone('utc', now()), 0, 3, 10, 'none', 'epoch_2'),
	('0xef05ee60799ea122db2ace21425f6d4991dd3805', 'airdrop', timezone('utc', now()), 0, 1, 100, 'none', 'epoch_2'),
	('0xef05ee60799ea122db2ace21425f6d4991dd3805', 'airdrop', timezone('utc', now()), 0, 2, 50, 'none', 'epoch_2'),
	('0xef05ee60799ea122db2ace21425f6d4991dd3805', 'airdrop', timezone('utc', now()), 0, 3, 10, 'none', 'epoch_2'),
	('0x0b0154cbfaba8a18caf5fcba2b83ce383c1a0095', 'airdrop', timezone('utc', now()), 0, 1, 100, 'none', 'epoch_2'),
	('0x0b0154cbfaba8a18caf5fcba2b83ce383c1a0095', 'airdrop', timezone('utc', now()), 0, 2, 50, 'none', 'epoch_2'),
	('0x0b0154cbfaba8a18caf5fcba2b83ce383c1a0095', 'airdrop', timezone('utc', now()), 0, 3, 10, 'none', 'epoch_2'),
	('0x225e02bd307a5af7608ceff02a4e48ba06be4ddd', 'airdrop', timezone('utc', now()), 0, 1, 100, 'none', 'epoch_2'),
	('0x225e02bd307a5af7608ceff02a4e48ba06be4ddd', 'airdrop', timezone('utc', now()), 0, 2, 50, 'none', 'epoch_2'),
	('0x225e02bd307a5af7608ceff02a4e48ba06be4ddd', 'airdrop', timezone('utc', now()), 0, 3, 10, 'none', 'epoch_2');

INSERT INTO lootbox_config (
	is_current_program,
	program_begin,
	program_end,
	epoch_identifier,
	ethereum_application
)

VALUES (
	FALSE,
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP + INTERVAL '30 days',
	'epoch_2',
	'none'
);

-- migrate:down

DELETE FROM lootbox
WHERE
	(address = '0x75964ac8cc1676eb51451f25faaaefd40ccde602' AND source = 'airdrop' AND reward_tier = 1 AND lootbox_count = 100 AND epoch = 'epoch_2') OR (address = '0x75964ac8cc1676eb51451f25faaaefd40ccde602' AND source = 'airdrop' AND reward_tier = 2 AND lootbox_count = 50 AND epoch = 'epoch_2') OR (address = '0x75964ac8cc1676eb51451f25faaaefd40ccde602' AND source = 'airdrop' AND reward_tier = 3 AND lootbox_count = 10 AND epoch = 'epoch_2') OR (address = '0x75964ac8cc1676eb51451f25faaaefd40ccde602' AND source = 'airdrop' AND reward_tier = 4 AND lootbox_count = 1 AND epoch = 'epoch_2')
	OR (address = '0xd1d13003128cb454ff562850f86413498c1ebedf' AND source = 'airdrop' AND reward_tier = 1 AND lootbox_count = 100 AND epoch = 'epoch_2') OR (address = '0xd1d13003128cb454ff562850f86413498c1ebedf' AND source = 'airdrop' AND reward_tier = 2 AND lootbox_count = 50 AND epoch = 'epoch_2') OR (address = '0xd1d13003128cb454ff562850f86413498c1ebedf' AND source = 'airdrop' AND reward_tier = 3 AND lootbox_count = 10 AND epoch = 'epoch_2')
	OR (address = '0x8cb42fe548bb51ca4125eac3c14cf177b2b183d8' AND source = 'airdrop' AND reward_tier = 1 AND lootbox_count = 100 AND epoch = 'epoch_2') OR (address = '0x8cb42fe548bb51ca4125eac3c14cf177b2b183d8' AND source = 'airdrop' AND reward_tier = 2 AND lootbox_count = 50 AND epoch = 'epoch_2') OR (address = '0x8cb42fe548bb51ca4125eac3c14cf177b2b183d8' AND source = 'airdrop' AND reward_tier = 3 AND lootbox_count = 10 AND epoch = 'epoch_2')
	OR (address = '0xb363335ff6e0a91f870c200bf6fcb38d1fd0f346' AND source = 'airdrop' AND reward_tier = 1 AND lootbox_count = 100 AND epoch = 'epoch_2') OR (address = '0xb363335ff6e0a91f870c200bf6fcb38d1fd0f346' AND source = 'airdrop' AND reward_tier = 2 AND lootbox_count = 50 AND epoch = 'epoch_2') OR (address = '0xb363335ff6e0a91f870c200bf6fcb38d1fd0f346' AND source = 'airdrop' AND reward_tier = 3 AND lootbox_count = 10 AND epoch = 'epoch_2')
	OR (address = '0x2d0eb64ffc36339a15c531b64fd55404ca7f8f62' AND source = 'airdrop' AND reward_tier = 1 AND lootbox_count = 100 AND epoch = 'epoch_2') OR (address = '0x2d0eb64ffc36339a15c531b64fd55404ca7f8f62' AND source = 'airdrop' AND reward_tier = 2 AND lootbox_count = 50 AND epoch = 'epoch_2') OR (address = '0x2d0eb64ffc36339a15c531b64fd55404ca7f8f62' AND source = 'airdrop' AND reward_tier = 3 AND lootbox_count = 10 AND epoch = 'epoch_2')
	OR (address = '0x32f5de0d8f24094c660979ae34772985a1a8c831' AND source = 'airdrop' AND reward_tier = 1 AND lootbox_count = 100 AND epoch = 'epoch_2') OR (address = '0x32f5de0d8f24094c660979ae34772985a1a8c831' AND source = 'airdrop' AND reward_tier = 2 AND lootbox_count = 50 AND epoch = 'epoch_2') OR (address = '0x32f5de0d8f24094c660979ae34772985a1a8c831' AND source = 'airdrop' AND reward_tier = 3 AND lootbox_count = 10 AND epoch = 'epoch_2')
	OR (address = '0x2da7958dc2a33e7720935102107f0886e8ab6574' AND source = 'airdrop' AND reward_tier = 1 AND lootbox_count = 100 AND epoch = 'epoch_2') OR (address = '0x2da7958dc2a33e7720935102107f0886e8ab6574' AND source = 'airdrop' AND reward_tier = 2 AND lootbox_count = 50 AND epoch = 'epoch_2') OR (address = '0x2da7958dc2a33e7720935102107f0886e8ab6574' AND source = 'airdrop' AND reward_tier = 3 AND lootbox_count = 10 AND epoch = 'epoch_2')
	OR (address = '0xf6352e3a8e502b93af36821cc6f45d6f37ac4aed' AND source = 'airdrop' AND reward_tier = 1 AND lootbox_count = 100 AND epoch = 'epoch_2') OR (address = '0xf6352e3a8e502b93af36821cc6f45d6f37ac4aed' AND source = 'airdrop' AND reward_tier = 2 AND lootbox_count = 50 AND epoch = 'epoch_2') OR (address = '0xf6352e3a8e502b93af36821cc6f45d6f37ac4aed' AND source = 'airdrop' AND reward_tier = 3 AND lootbox_count = 10 AND epoch = 'epoch_2')
	OR (address = '0xef05ee60799ea122db2ace21425f6d4991dd3805' AND source = 'airdrop' AND reward_tier = 1 AND lootbox_count = 100 AND epoch = 'epoch_2') OR (address = '0xef05ee60799ea122db2ace21425f6d4991dd3805' AND source = 'airdrop' AND reward_tier = 2 AND lootbox_count = 50 AND epoch = 'epoch_2') OR (address = '0xef05ee60799ea122db2ace21425f6d4991dd3805' AND source = 'airdrop' AND reward_tier = 3 AND lootbox_count = 10 AND epoch = 'epoch_2')
	OR (address = '0x0b0154cbfaba8a18caf5fcba2b83ce383c1a0095' AND source = 'airdrop' AND reward_tier = 1 AND lootbox_count = 100 AND epoch = 'epoch_2') OR (address = '0x0b0154cbfaba8a18caf5fcba2b83ce383c1a0095' AND source = 'airdrop' AND reward_tier = 2 AND lootbox_count = 50 AND epoch = 'epoch_2') OR (address = '0x0b0154cbfaba8a18caf5fcba2b83ce383c1a0095' AND source = 'airdrop' AND reward_tier = 3 AND lootbox_count = 10 AND epoch = 'epoch_2')
	OR (address = '0x225e02bd307a5af7608ceff02a4e48ba06be4ddd' AND source = 'airdrop' AND reward_tier = 1 AND lootbox_count = 100 AND epoch = 'epoch_2') OR (address = '0x225e02bd307a5af7608ceff02a4e48ba06be4ddd' AND source = 'airdrop' AND reward_tier = 2 AND lootbox_count = 50 AND epoch = 'epoch_2') OR (address = '0x225e02bd307a5af7608ceff02a4e48ba06be4ddd' AND source = 'airdrop' AND reward_tier = 3 AND lootbox_count = 10 AND epoch = 'epoch_2')

DELETE FROM lootbox_config WHERE epoch_identifier = 'epoch_2';
