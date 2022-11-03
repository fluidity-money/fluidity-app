import ethInstructions from "./ethereum/instructions";

const claimRewards = async (address: string, network: string) => {
  switch (network) {
    case "ethereum":
      return ethInstructions.claimRewards(address);
    default:
      return [];
  }
};

export { claimRewards };
