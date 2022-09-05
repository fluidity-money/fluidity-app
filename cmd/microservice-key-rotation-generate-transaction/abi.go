package main

import "github.com/ethereum/go-ethereum/accounts/abi"

var workerConfigAbi abi.ABI

const workerConfigAbiString = `[
  {
      "inputs": [
        {
        "components": [
           { "internalType": "address", "name": "contractAddr", "type": "address" },
           { "internalType": "address", "name": "newOracle", "type": "address" }
         ],
         "internalType": "struct OracleUpdate[]",
         "name": "newOracles",
         "type": "tuple[]"
        }
        ],
    "name": "updateOracles",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]`
