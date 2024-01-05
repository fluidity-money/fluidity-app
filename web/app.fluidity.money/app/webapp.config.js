const options = {
  // Chains
  drivers: {
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
