// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

const integrationTestCurve = `[
  {
    "transfer": {
      "transaction": "0x760e91228414633e92442fcc09b282a285fef1659e452dff4ad151f485820fcf",
      "log": {
        "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPw3kzwCL1IK5pwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARhoKPts=",
        "address": "0xa5407eae9ba41422680e2e00537571bcc53efbfd",
        "topics": [
          "0x8b3e96f2b889fa771c53c981b40daf005f63f637f1869f707052d15a3dd97140",
          "0x000000000000000000000000fecd95438a950acaad9efd48ec93628855dbd5e5"
        ]
      }
    },
    "transaction": {
      "to": "0xfecd95438a950acaad9efd48ec93628855dbd5e5",
      "from": "0x1642b6313b8d374812381c3373d0c2983aebfc8f",
      "hash": "0x760e91228414633e92442fcc09b282a285fef1659e452dff4ad151f485820fcf"
    },
    "application": 0,
    "expected_sender": "0x1642b6313b8d374812381c3373d0c2983aebfc8f",
    "expected_recipient": "0xfecd95438a950acaad9efd48ec93628855dbd5e5",
    "expected_fees": "1/0",
    "token_decimals": 0,
    "contract_address": "0xa5407eae9ba41422680e2e00537571bcc53efbfd"
  }
]
`
