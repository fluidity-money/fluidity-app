const options = {
  // Chains
  drivers: {
    ethereum: [
      {
        label: "Ethereum",
        testnet: false,
        rpc: {
          http: "https://mainnet.infura.io/v3/your-api-key",
          ws: "wss://mainnet.infura.io/ws/v3/your-api-key",
        },
      },
    ],
    solana: [
      {
        label: "Solana",
        testnet: false,
        rpc: {
          http: "https://api.mainnet-beta.solana.com",
          ws: "wss://api.mainnet-beta.solana.com",
        },
      },
    ],
  },
};

export default options;
