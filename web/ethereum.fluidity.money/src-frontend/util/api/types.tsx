
export type WebsocketUserAction = {
  event_number: number,
  network: string,
  type: string,
  transaction_hash: string,
  swap_in: boolean,
  sender_address: string,
  recipient_address: string,
  amount: string,
  time: string
};

export type Routes = {
  // Dashboard Prize Board API Route (for Graph as well)
  "/prize-board": {
    winning_amount: string,
    winner_address: string,
    awarded_time: string
  }[],

  // Dashboard Reward Pool API Route
  "/prize-pool": {
    network: string,
    contract_address: string,
    amount: string,
    last_updated: string
  },

  "/past-winnings": {
    amount_of_winners: number,
    winning_date: string,
    winning_amount: string
  }[],

  // Transaction History API Route
  "/my-history": WebsocketUserAction[],
}

export type WebsocketWinner = {
  network: string,
  transaction_hash: string,
  winner_address: string,
  winning_amount: string,
  awarded_time: string
};

export type WebsocketMessage = {
  winner?: WebsocketWinner,
  user_action?: WebsocketUserAction,
  prize_pool?: Routes['/prize-pool'],
}

export default Routes;
