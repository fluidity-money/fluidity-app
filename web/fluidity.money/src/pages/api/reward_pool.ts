import type { NextApiHandler } from "next";

import { getEthTotalPrizePool, getTotalTransactions } from "data/ethereum";

export type IPropPools = {
  totalTransactions: number;
  ethPool: number;
  solPool: number;
};

const handler: NextApiHandler = async(_, res) => {
  const [
    totalTransactions,
    ethPool,
    solPool,
  ] = await Promise.all([
    getTotalTransactions(),
    getEthTotalPrizePool(),
    Promise.resolve(() => 0),
  ]);

  res.status(200).json({ totalTransactions, ethPool, solPool });
};

export default handler;
