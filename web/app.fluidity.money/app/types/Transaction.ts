type Transaction = {
  sender: string;
  receiver: string;
  reward: number;
  hash: string;
  // timestamp is the Unix time, in seconds
  timestamp: number;
  value: number;
  currency: string;
  logo: string;
};

export default Transaction;
