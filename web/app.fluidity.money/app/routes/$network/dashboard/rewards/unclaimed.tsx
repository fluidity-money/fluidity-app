import type { Chain } from "~/util/chainUtils/chains";

import { useState, useEffect } from "react";
import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { UserRewards } from "./common";

import TransactionTable from "~/components/TransactionTable";
import { Heading } from "@fluidity-money/surfing";

export type Transaction = {
  sender: string;
  receiver: string;
  timestamp: number;
  value: number;
  currency: string;
};

const address = "0xbb9cdbafba1137bdc28440f8f5fbed601a107bb6";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { network } = params;

  const url = new URL(request.url);
  const _pageStr = url.searchParams.get("page");
  const _pageUnsafe = _pageStr ? parseInt(_pageStr) : 1;
  const page = _pageUnsafe > 0 ? _pageUnsafe : 1;

  const transactions: Transaction[] = [];
  const count = 0;

  return json({
    transactions,
    count,
    page,
    network,
    userUnclaimedRewards: 0,
  });
};

type LoaderData = {
  transactions: Transaction[];
  count: number;
  page: number;
  network: Chain;
  userUnclaimedRewards: number;
};

const UnclaimedWinnings = () => {
  const { transactions, count, page, network, userUnclaimedRewards } =
    useLoaderData<LoaderData>();

  const [unclaimedRewards, setUnclaimedRewards] =
    useState(userUnclaimedRewards);

  useEffect(() => {
    fetch("/pending-rewards", {
      headers: {
        "Content-Type": "application/json",
      },
      body: address,
    })
      .then((res) => setUnclaimedRewards(res.body()))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      {/* Info Card */}
      <UserRewards
        claimNow={true}
        unclaimedRewards={unclaimedRewards}
        network={network}
      />

      <Heading as={"h2"}>Your Winnings</Heading>

      {/* Unclaimed Transactions */}
      <section id="table">
        <TransactionTable
          page={page}
          count={count}
          transactions={transactions}
          chain={network}
          address={address}
        />
      </section>
    </>
  );
};

export default UnclaimedWinnings;
