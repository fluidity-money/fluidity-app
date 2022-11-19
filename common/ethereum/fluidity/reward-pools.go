// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package fluidity

const rewardPoolAbiString = `[
  {
    "inputs": [
      {
        "internalType": "contract Token",
        "name": "t",
        "type": "address"
      }
    ],
    "name": "addToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPools",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "uint8",
            "name": "decimals",
            "type": "uint8"
          }
        ],
        "internalType": "struct RewardPool[]",
        "name": "rewardPool",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
`
