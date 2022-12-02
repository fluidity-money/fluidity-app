export enum NotificationType {
  ONCHAIN = 1,
  WINNING_REWARD_DATABASE,
  PENDING_REWARD_DATABASE,
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
