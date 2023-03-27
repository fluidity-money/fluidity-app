// Types inherited from the old notification service

/**
 * Transaction types for the notification service.
 * 
 * @enum {number}
 * @readonly 
 */
export enum NotificationType {
    ONCHAIN = 1,
    WINNING_REWARD,
    PENDING_REWARD,
    CLAIMED_WINNING_REWARD,
}

/**
 * Transaction is a type that represents a transaction that is emitted by the notification service.
 */
export type Transaction = {
    type: NotificationType;
    source: string;
    destination: string;
    amount: string;
    token: string;
    transactionHash: string;
    rewardType: string;
};

export type WinnerData = {
    transaction_hash: string;
    token_short_name: string;
    winning_address: string;
    token_decimals: number;
    winning_amount: number;
    reward_type: string;
    network: string;
};

export type PendingWinnerData = {
    transaction_hash: string;
    token_short_name: string;
    address: string;
    token_decimals: number;
    win_amount: number;
    reward_type: string;
};

export type WinnerEvent = {
    data: {
        winners: WinnerData[];
    };
};

export type PendingWinnerEvent = {
    data: {
        ethereum_pending_winners: PendingWinnerData[];
    };
};