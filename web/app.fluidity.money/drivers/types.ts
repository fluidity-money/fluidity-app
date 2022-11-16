export type PipedTransaction = {
  type: "rewardDB" | "onChain";
  source: string;
  destination: string;
  amount: string;
  token: string;
  transactionHash: string;
};
