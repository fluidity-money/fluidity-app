export type TokenDetails = {
  token_short_name: string;
  token_decimals: number;
};

export type WebsocketUserAction = {
  event_number: number;
  type: string;
  transaction_hash: string;
  swap_in: boolean;
  sender_address: string;
  recipient_address: string;
  amount: string;
  token_details: TokenDetails;
  time: string;
};

export type Routes = {
  // Dashboard Prize Board API Route (for Graph as well)
  "/prize-board": {
    winning_amount: string;
    winner_address: string;
    awarded_time: string;
    token_details: TokenDetails;
  }[];

  // Dashboard Reward Pool API Route
  "/prize-pool": {
    contract_address: string;
    amount: string;
    last_updated: string;
  };

  "/past-winnings": {
    amount_of_winners: number;
    winning_date: string;
    winning_amount: string;
  }[];

  // Transaction History API Route
  "/my-history": WebsocketUserAction[];

  // Pending wins by user that can be manually transacted    
  "/pending-rewards": {
    token_details: TokenDetails;
    transaction_hash: string;
    from_address: string;
    to_address: string;
    winning_amount: string;
  }[];

  "/manual-reward": {
    reward: {
      transaction_hash: string,
      from: string,
      to: string,
      winning_amount: string;
    };
    // Go encodes []byte as a `\x`-escaped B64 hex string
    signature: string
  }
};

export type WebsocketWinner = {
  transaction_hash: string;
  winner_address: string;
  winning_amount: string;
  awarded_time: string;
  token_details: TokenDetails;
};

export type WebsocketMessage = {
  winner?: WebsocketWinner;
  user_action?: WebsocketUserAction;
  prize_pool?: Routes["/prize-pool"];
};

export default Routes;
