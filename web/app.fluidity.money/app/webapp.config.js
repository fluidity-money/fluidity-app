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
  ethereum: {
    currencies: [
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    ],
  },
  tokens: {
    colours: {
      fUSDC: "#2775ca",
      fUSDT: "#12946c",
      fDAI:  "#825902",
      fTUSD: "#1da1f2",
      fFRAX: "#e84142",
    },
    logos: {
      fUSDC: "images/tokenIcons/usdcFluid.svg",
      fUSDT: "images/tokenIcons/usdtFluid.svg",
      fDAI:  "images/tokenIcons/daiFluid.svg",
      fTUSD: "images/tokenIcons/tusdFluid.svg",
      fFRAX: "images/tokenIcons/fraxFluid.svg",      
    }
  }
};

export default options;
