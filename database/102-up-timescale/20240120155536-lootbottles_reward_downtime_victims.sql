
-- db:migrate up

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
	('0xaec109dcd8521d4e12a7ec04532cbf9ecaffcc52', 'airdrop', timezone('utc', now()), 0, 1, 10, 'none', 'epoch_2'),
	('0x9d4360fd74884e4badb49b59f31207822d38e84c', 'airdrop', timezone('utc', now()), 0, 1, 10, 'none', 'epoch_2');

-- db:migrate down

DELETE FROM lootbox WHERE
	epoch = 'epoch_2' AND lootbox_count = 10 AND reward_tier = 1
	AND
	(
		address = '0xaec109dcd8521d4e12a7ec04532cbf9ecaffcc52'
		OR address = '0x9d4360fd74884e4badb49b59f31207822d38e84c'
	);
