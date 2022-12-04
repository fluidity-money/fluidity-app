export enum NotificationType {
  ONCHAIN = 1,
  WINNING_REWARD,
  PENDING_REWARD,
  CLAIMED_WINNING_REWARD,
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
