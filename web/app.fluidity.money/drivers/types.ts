export enum NotificationType {
  ONCHAIN = 1,
  REWARD_DATABASE,
}

export type PipedTransaction = {
  type: NotificationType;
  source: string;
  destination: string;
  amount: string;
  token: string;
  transactionHash: string;
  rewardType: string;
};
