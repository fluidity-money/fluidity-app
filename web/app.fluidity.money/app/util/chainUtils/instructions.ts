import ethInstructions from "./ethereum/instructions";

export type TransactionResponse = {
  confirmTx: () => Promise<boolean>;
  txHash: string;
};

const claimRewards = async (address: string, network: string) => {
  switch (network) {
    case "ethereum":
      return ethInstructions.claimRewards(address);
    default:
      return [];
  }
};

export { claimRewards };
