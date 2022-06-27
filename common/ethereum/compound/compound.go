package compound

import (
	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

const cTokenContractAbiString = `[
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "balanceOfUnderlying",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x3af9e669"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "supplyRatePerBlock",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xae9d70b0"
    }
]`

// cTokenContractAbi set by init.go to contain the CToken ABI code that
// can be used with a bound contract
var cTokenContractAbi ethAbi.ABI
