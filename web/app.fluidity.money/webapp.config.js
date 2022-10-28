const options = {
  // Chains
  drivers: {
    ethereum: [
      {
        label: "Ethereum",
        testnet: false,
        rpc: {
          http: process.env["FLU_ETH_RPC_HTTP"],
          ws: process.env["FLU_ETH_RPC_WS"],
        },
      },
    ],
    solana: [
      {
        label: "Solana",
        testnet: false,
        rpc: {
          http: process.env["FLU_SOL_RPC_HTTP"],
          ws: process.env["FLU_SOL_RPC_WS"],
        },
      },
    ],
  },
};

export default options;
