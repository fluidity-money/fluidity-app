INSERT INTO past_winnings VALUES (
	CURRENT_DATE,
	1000,
	1020,
	'ethereum'
);

INSERT INTO past_winnings VALUES (
	CURRENT_DATE - INTERVAL '1' DAY,
	782,
	472,
	'ethereum'
);

INSERT INTO past_winnings VALUES (
	CURRENT_DATE,
	489,
	108,
	'solana'
);

INSERT INTO past_winnings VALUES (
	CURRENT_DATE - INTERVAL '1' DAY,
	578,
	823,
	'solana'
);

INSERT INTO winners VALUES (
	'ethereum',
	'0xabc',
	'0x00000000000000000000000000000000',
	500,
	'2022-05-08',
	now(),
	'USDC',
	6,
	NULL
);

INSERT INTO winners VALUES (
	'ethereum',
	'0xabc',
	'0x00000000000000000000000000000001',
	500,
	'2022-05-07',
	now(),
	'USDC',
	6,
	NULL
);
INSERT INTO winners VALUES (
	'ethereum',
	'0xabc',
	'0x00000000000000000000000000000002',
	1500000000000000000,
	'2022-05-08',
	now(),
	'DAI',
	18,
	NULL
);

INSERT INTO winners VALUES (
	'solana',
	'abc',
	'3',
	500,
	'2022-05-08',
	now(),
	'USDC',
	6,
	NULL
);

INSERT INTO worker_emissions VALUES (
	-- transaction info
	'0x00000000000000000000000000000000',
	'0x00000000000000000000000000000001',
	'0x00000000000000000000000000000002',
	'ethereum',
	'usdt',
	10,

	-- payout
	0.654,
	10.11,
	0.2152641878669276,
	7,
	18,
	4,
	1.5242523,
	5.5151234,
	413.141,
	412.41241234,
	1234.1551,
	153245124,
	412.12341,

	-- probability CalculateN
	0.80,
	0.4512,
	341.341,
	35414,

	-- probability NaiveIsWinning
	'{
	    1000,
	    1001,
	    1002,
	    1003
	}',

	-- probability CalculateBpy
	123456789,
	431.241,
	4123415321.123,

	-- aave GetTokenApy
	231.14312,
	4312.141,
	1341.12341,
	4123.151,
	4123.51543,

	-- compound GetTokenApy
	2,
	41212.51241,
	314.12341,
	1234.1324,
	41.52345,
	6243.52342,

	-- WinningChances
	0.0013
);
