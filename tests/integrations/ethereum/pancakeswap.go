// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

// integrationTestPancakeswap is tested with us in a broader lifi
// transaction, and a transaction that doesn't include us.
const integrationTestPancakeswap = `	[
	{
		"transfer": {
			"transaction": "0xcec460b14b3b11e8dbb0e8afda4a3189faea78836a60cb324abfebce32ffa304",
			"log": {
				"data": "//////////////////////////////////////7KWcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATWwcQAAAAAAAAAAAAAAAAAAAAAAAAABAAERlr0lzlQtgf6GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEg5lGpVoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAp0=",
				"address": "0x38437dbfd1d6a147a50cd0991a9581ac8f996892",
				"topics": [
					"0x19b47279256b2a23a1665c810c8d55a1758940ee09377d4f8d26497a3577dc83",
					"0x000000000000000000000000e37e799d5077682fa0a244d46e5649f71457bd09",
					"0x0000000000000000000000001111111254eeb25477b68fb85ed929f73a960582"
				],
				"log_index": "6"
			},
			"application": 30
		},
		"transaction": {
			"to": "0x38437dbfd1d6a147a50cd0991a9581ac8f996892",
			"from": "0x6ebcd1bffb2d6be2efc3c33f09250a95745b7bb1",
			"hash": "0xcec460b14b3b11e8dbb0e8afda4a3189faea78836a60cb324abfebce32ffa304"
		},
		"expected_sender": "0x6ebcd1bffb2d6be2efc3c33f09250a95745b7bb1",
		"expected_recipient": "0x38437dbfd1d6a147a50cd0991a9581ac8f996892",
		"expected_fees": "0/1",
		"expected_volume": "317081/15625",
		"expected_emission": {
			"pancakeswap": 0
		},
		"rpc_methods": {},
		"call_methods": {
			"token0()": {
				"": "0x0000000000000000000000004CFA50B7Ce747e2D61724fcAc57f24B748FF2b2A"
			},
			"token1()": {
				"": "0x000000000000000000000000af88d065e77c8cC2239327C5EDb3A432268e5831"
			}
		},
		"token_decimals": 6,
		"contract_address": "0x4cfa50b7ce747e2d61724fcac57f24b748ff2b2a"
	},
	{
		"transfer": {
			"transaction": "0x4d86b0f941072e96ea3876d2c256deeb23c801260e330e3a042f2ed2e33064ec",
			"log": {
				"data": "//////////////////////////////////////5KIDUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbXtYgAAAAAAAAAAAAAAAAAAAAAAAAABAADTGNr2LWCujn7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGjYIWUBYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA7M=",
				"address": "0x38437dbfd1d6a147a50cd0991a9581ac8f996892",
				"topics": [
					"0x19b47279256b2a23a1665c810c8d55a1758940ee09377d4f8d26497a3577dc83",
					"0x000000000000000000000000474e51f692a724cd054bcaa07ccd094c9c7d93a0",
					"0x0000000000000000000000006d6e11ee57b784ab0b0e5738ad142016d0ac083a"
				],
				"log_index": "6"
			},
			"application": 30
		},
		"transaction": {
			"to": "0x38437dbfd1d6a147a50cd0991a9581ac8f996892",
			"from": "0x22225f25f6c3e90cf25c370085026bfb19f586e6",
			"hash": "0x4d86b0f941072e96ea3876d2c256deeb23c801260e330e3a042f2ed2e33064ec"
		},
		"expected_sender": "0x22225f25f6c3e90cf25c370085026bfb19f586e6",
		"expected_recipient": "0x38437dbfd1d6a147a50cd0991a9581ac8f996892",
		"expected_fees": "0/1",
		"expected_volume": "28696523/1000000",
		"expected_emission": {
			"pancakeswap": 0
		},
		"rpc_methods": {},
		"call_methods": {
			"token0()": {
				"": "0x0000000000000000000000004CFA50B7Ce747e2D61724fcAc57f24B748FF2b2A"
			},
			"token1()": {
				"": "0x000000000000000000000000af88d065e77c8cC2239327C5EDb3A432268e5831"
			}
		},
		"token_decimals": 6,
		"contract_address": "0x4cfa50b7ce747e2d61724fcac57f24b748ff2b2a"
	}
	]
`
