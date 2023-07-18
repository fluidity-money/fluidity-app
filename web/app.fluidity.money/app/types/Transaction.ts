type Transaction = {
  sender: string;
  receiver: string;
  winner: string;
  reward: number;
  hash: string;
  rewardHash: string;
  // timestamp is the Unix time, in seconds
  timestamp: number;
  value: number;
  currency: string;
  logo: string;
  provider: string;
  swapType?: "in" | "out";
  utilityTokens?: { [tokens: string]: number };
};

export default Transaction;
