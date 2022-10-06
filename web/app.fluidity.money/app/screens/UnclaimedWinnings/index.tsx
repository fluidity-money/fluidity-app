import type { Chain } from "~/util/chainUtils/chains";

import TransactionTable from "~/screens/TransactionTable";
import {
  Heading,
} from "@fluidity-money/surfing";

export type Transaction = {
  sender: string;
  receiver: string;
  timestamp: number;
  value: number;
  currency: string;
};

export type Rewarder = {
  iconUrl: string;
  name: string;
  prize: number;
  avgPrize: number;
}


type IRewardPerformance = {
  transactions: Transaction[];
  count: number;
  page: number;
  network: Chain;
}


const UnclaimedWinnings = ({transactions, count, page, network}: IRewardPerformance) => {
  return (
    <>
      <Heading as={"h2"}>
        Your Winnings
      </Heading>

      {/* Unclaimed Transactions */}
      <section id="table">
        <TransactionTable
          page={page}
          count={count}
          transactions={transactions}
          chain={network}
        />
      </section>
    </>
  );
}

export default UnclaimedWinnings;
