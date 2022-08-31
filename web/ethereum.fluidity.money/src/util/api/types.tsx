// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import {SupportedContracts} from "util/contractList";

export type TokenDetails = {
  token_short_name: SupportedContracts;
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
    [token: string]: {
      token_details: TokenDetails;
      winner: string;
      amount: string;
      first_block: string;
      last_block: string;
    }
  };

  "/manual-reward": {
    error: string,
    payload: {
      reward: {
        token: TokenDetails;
        winner: string;
        win_amount: string;
        first_block: string;
        last_block: string;
      };
      // Go encodes []byte as a `\x`-escaped B64 hex string
      signature: string
    }
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
