package test_multichain

const integrationTestMultichain = `[
{
	"transfer": {
		"log": {
			"data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKwVpk1O2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKSx",
			"address": "0xba8da9dcf11b50b03fd5284f164ef5cdef910705",
			"topics": [
				"0x97116cf6cd4f6412bb47914d6db18da9e16ab2142f543b86e207c24fbd16b23a",
				"0x0000000000000000000000000615dbba33fe61a31c7ed131bda6655ed76748b1",
				"0x0000000000000000000000002f04ed87b5ac8b703565469311341b0b44e315d7",
				"0x0000000000000000000000002f04ed87b5ac8b703565469311341b0b44e315d7"
			]
		},
		"transaction": {
			"to": "0xba8da9dcf11b50b03fd5284f164ef5cdef910705",
			"from": "0x2f04ed87b5ac8b703565469311341b0b44e315d7",
			"hash": "0x1d2d9680b266271ed86992805a44e72db87c9b2f30b96a818fb2b94e18b8351b"
		},
		"application": 8
	},
	"expected_sender": "0x2f04ed87b5ac8b703565469311341b0b44e315d7",
	"expected_recipient": "0xba8da9dcf11b50b03fd5284f164ef5cdef910705",
	"expected_fees": "40/1",
	"token_decimals": 18,
	"contract_address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
},
{
	"transfer": {
		"log": {
			"data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAABBRlWKTaphS0fUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKhq",
			"address": "0x765277eebeca2e31912c9946eae1021199b39c61",
			"topics": [
				"0x97116cf6cd4f6412bb47914d6db18da9e16ab2142f543b86e207c24fbd16b23a",
				"0x00000000000000000000000041471fbf66dafb95b682afaf1426bee11f25e10a",
				"0x00000000000000000000000031ed5415795cda9b5c91294f45c764c964eb9422",
				"0x00000000000000000000000031ed5415795cda9b5c91294f45c764c964eb9422"
			]
		},
		"transaction": {
			"to": "0x765277eebeca2e31912c9946eae1021199b39c61",
			"from": "0x31ed5415795cda9b5c91294f45c764c964eb9422",
			"hash": "0x3d6b9a89f85e3b194e60dc3cdef93ce04d28ccf1f2de2472c67fef38e1c69ca7"
		},
		"application": 8
	},
	"expected_sender": "0x31ed5415795cda9b5c91294f45c764c964eb9422",
	"expected_recipient": "0x765277eebeca2e31912c9946eae1021199b39c61",
	"expected_fees": "1000/1",
	"token_decimals": 18,
	"contract_address": "0x18a1ea69a50a85752b7bc204a2c45a95ce6e429d"
},
{
	"transfer": {
		"log": {
			"data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE23MlR2MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4",
			"address": "0xba8da9dcf11b50b03fd5284f164ef5cdef910705",
			"topics": [
				"0x97116cf6cd4f6412bb47914d6db18da9e16ab2142f543b86e207c24fbd16b23a",
				"0x0000000000000000000000000615dbba33fe61a31c7ed131bda6655ed76748b1",
				"0x000000000000000000000000da5a5b5daeccc6a85693c82b94634044b66dc3ee",
				"0x000000000000000000000000da5a5b5daeccc6a85693c82b94634044b66dc3ee"
			]
		},
		"transaction": {
			"to": "0xba8da9dcf11b50b03fd5284f164ef5cdef910705",
			"from": "0xda5a5b5daeccc6a85693c82b94634044b66dc3ee",
			"hash": "0x0284dcd7bff6ad8c6dba9e96fdc94af5f87ee29760f1ed002433e28eb53b0f2d"
		},
		"application": 8
	},
	"expected_sender": "0xda5a5b5daeccc6a85693c82b94634044b66dc3ee",
	"expected_recipient": "0xba8da9dcf11b50b03fd5284f164ef5cdef910705",
	"expected_fees": "40/1",
	"token_decimals": 18,
	"contract_address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
}]`
