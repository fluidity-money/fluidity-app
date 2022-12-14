export type TransactionResponse = {
  confirmTx: () => Promise<boolean>;
  txHash: string;
};
