#!/bin/sh -e

export \
	FLU_WORKER_ID=microservice-common-count-wins \
	FLU_DEBUG=true \
	FLU_TIMESCALE_URI=postgres://fluidity:fluidity@localhost:5433?sslmode=disable

alias psql_connect="psql $FLU_TIMESCALE_URI"

psql_connect <<EOF
INSERT INTO winners VALUES
	(
		'ethereum',
		'0xeb0x0s1dq180tn8wd84q288t0438642qf78wh245',
		'0x314wq3mu2m26srb07gvum08x624ut7f753e15cqj',
		'10020000000000000000.2102',
		TIMESTAMP 'yesterday',
		TIMESTAMP 'yesterday',
		'USDC',
		18,
		NULL
	),
	(
		'ethereum',
		'0x3cyp1ew67viqx80a6jd7268w74pyw6o738q6k32q',
		'0xy811iu561qfxdlk36d2134e4k5xu3d837eqs6ad8',
		'10080000000000000000.2102',
		TIMESTAMP 'yesterday',
		TIMESTAMP 'yesterday',
		'USDC',
		18,
		NULL
	),
	(
		'ethereum',
		'0xd5sys252psbv5c5xcc11hxreuq6ve211h54m5f13',
		'0x6s517845240k1t202xwu3r4f5no4k32145208w63',
		'12000000000000000000.2102',
		TIMESTAMP 'yesterday',
		TIMESTAMP 'yesterday',
		'USDC',
		18,
		NULL
	),
	(
		'ethereum',
		'0xk2vj72mfm2711k3y6043o672fbutp2oui8s0fy7e',
		'0x7s4j56672278v3w046e508ur4cnad6340hj0n1cu',
		'108200000000000000000.2102',
		TIMESTAMP 'yesterday',
		TIMESTAMP 'yesterday',
		'USDC',
		18,
		NULL
	),
	(
		'ethereum',
		'0xs42gx6hpy5kj7c111m5qpq1fh64ii47x47645267',
		'0x4xl62t12e387h83p4lt347v788p6aj122835sj78',
		'10920000000000000000.2102',
		TIMESTAMP 'yesterday',
		TIMESTAMP 'yesterday',
		'USDC',
		18,
		NULL
	),
	(
		'ethereum',
		'0x2qj0wi36o0ecwc56aq56dn658r2grq8o0d8agql7',
		'0x5da2o2y3y52anb62y2os2d5q5s23h14t3r1331rq',
		'50020000000000000000.2102',
		TIMESTAMP 'yesterday',
		TIMESTAMP 'yesterday',
		'USDC',
		18,
		NULL
	)
EOF

./microservice-common-count-wins.out

psql_connect <<EOF
DO \$\$ BEGIN
	ASSERT (
		SELECT winning_amount = 201.24
		FROM past_winnings
		WHERE network = 'ethereum'
	);
END;
\$\$
