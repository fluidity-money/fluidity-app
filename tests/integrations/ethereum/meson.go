// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

const integrationTestMeson = `
[
  {
    "transfer": {
      "transaction": "0x6e982f4abdbd256e2c316936c3e9ac0c1affd33440772d93322b411e38c1ec43",
      "log": {
      },
      "application": 15
    },
    "transaction": {
      "to": "0x25ab3efd52e6470681ce037cd546dc60726948d3",
      "from": "0x666d6b8a44d226150ca9058beebafe0e3ac065a2",
      "data": "gnyHzAEAAExyUMAAAAAAAOBtrxMAAAAD6gBkLue2CgoBIykBi8oKGlUdtxurtXhgZlvzD+/yHyNaLv0IrWsIziPm9YC7uenSvkwjk5d50b7FWpFmA7nd4ryq/T0tjq7NOPnj/wAAAAAAAAAAAAAAAJubdFy3wWWsNGrEnTSJV3V0lMa/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE=",
      "hash": "0x6e982f4abdbd256e2c316936c3e9ac0c1affd33440772d93322b411e38c1ec43"
    },
    "expected_sender": "0x9b9b745cb7c165ac346ac49d348957757494c6bf",
    "expected_recipient": "0x25ab3efd52e6470681ce037cd546dc60726948d3",
    "expected_fees": "501/500000",
	"expected_emission": {
		"meson": 0.001002
	},
	"rpc_methods": {
	},
	"call_methods": {
	},
    "token_decimals": 18,
    "contract_address": "0x6b175474e89094c44da98b954eedeac495271d0f"
  },
  {
    "transfer": {
      "transaction": "0x6399ca875b80af4d10b2b5ba32b739dc82c5a85ea4de011e6cd25482543c7979",
      "log": {
      },
      "application": 15
    },
    "transaction": {
      "to": "0x25ab3efd52e6470681ce037cd546dc60726948d3",
      "from": "0x666d6b8a44d226150ca9058beebafe0e3ac065a2",
      "data": "gnyHzAEAD3xUosAAAAAAACNQtb8AAA27oABkLuULAyQBIykBvzTn03B9KObiEDoHVcnW2u3aA/ihiMQDng+6lW6BcwLIK5I8qas0r1kYW7V0WlZeavEjgEiNCQ9URf32xUn24gAAAAAAAAAAAAAAANeGQ0GWYeteJGcU2/7ibhhKb75/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE=",
      "hash": "0x6399ca875b80af4d10b2b5ba32b739dc82c5a85ea4de011e6cd25482543c7979"
    },
    "expected_sender": "0xd78643419661eb5e246714dbfee26e184a6fbe7f",
    "expected_recipient": "0x25ab3efd52e6470681ce037cd546dc60726948d3",
    "expected_fees": "9/10",
	"expected_emission": {
		"meson": 0.9
	},
	"rpc_methods": {
	},
	"call_methods": {
	},
    "token_decimals": 18,
    "contract_address": "0x6b175474e89094c44da98b954eedeac495271d0f"
  },
  {
    "transfer": {
      "transaction": "0x4fe401520920b868198c5d45d4a7708fb0c28e64e7e51123684b931bea4416dc",
      "log": {
      },
      "application": 15
    },
    "transaction": {
      "to": "0x25ab3efd52e6470681ce037cd546dc60726948d3",
      "from": "0x666d6b8a44d226150ca9058beebafe0e3ac065a2",
      "data": "gnyHzAEAAREH3sgAAAAAAKdKsBAAAAAAAABkMUVIA+8BIykBw9H/yRVHb/GoqnvzT7IfcWlnKzgD1IODcXWSLxGT0XHN11ftdpKvm1gFsgf0Ka27yYC6p3VLeAPWxitN5SnVaAAAAAAAAAAAAAAAAA1CG2G0JDOHbN5J2E9GdX1KYzGZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE=",
      "hash": "0x4fe401520920b868198c5d45d4a7708fb0c28e64e7e51123684b931bea4416dc"
    },
    "expected_sender": "0x0d421b61b42433876cde49d84f46757d4a633199",
    "expected_recipient": "0x25ab3efd52e6470681ce037cd546dc60726948d3",
    "expected_fees": "0",
	"expected_emission": {
		"meson": 0
	},
	"rpc_methods": {
	},
	"call_methods": {
	},
    "token_decimals": 18,
    "contract_address": "0x6b175474e89094c44da98b954eedeac495271d0f"
  }
]
`
