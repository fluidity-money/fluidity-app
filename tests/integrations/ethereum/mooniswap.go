// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

const integrationTestMooniswap = `
[
	{
		"transfer": {
			"log": {
				"data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAApG52K8MDZ0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADNPtBQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJVy/N46fx97AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAvlAB/sAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADsVPLpuFYxqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
				"address: "0x61bb2fda13600c497272a8dd029313afdb125fd3",
				"topics": [
					"0x86c49b5d8577da08444947f1427d23ef191cfabf2c0788f93324d79e926a9302",
					"0x0000000000007f150bd6f54c40a34d7c3d5e9f56",
					"0x0000000000000000000000000000000000000000",
					"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
				]
			},
			"transaction": {
				"to": "0x0000000000007f150bd6f54c40a34d7c3d5e9f56",
				"from": "0xc04e9356b6cc9d164ad1733e165f7aa6fffc474c",
				"hash": "0xb9828b517292fad4a2991978b2a6a424dc6d319bbfd7fe166e3dd8f5be2ffe3b"
			},
			"application": 2
		},
	},
	"expected_sender": "0xc04e9356b6cc9d164ad1733e165f7aa6fffc474c",
	"expected_recipient": "0x61bb2fda13600c497272a8dd029313afdb125fd3",
	"expected_fees": "645645495/997",
    "token_decimals": 6,
    "contract_address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
]
`
