import type { NextApiHandler } from "next";

import { getEthTotalPrizePool, getTotalTransactions } from "data/ethereum";
import { getArbTotalPrizePool } from "data/ethereum/prizePool";

export type RewardPoolRes = {
  totalTransactions: number;
  ethPool: number;
  arbPool: number;
  solPool: number;
};

const handler: NextApiHandler = async (_, res) => {
  const [totalTransactions, ethPool, arbPool, solPool] = await Promise.all([
    getTotalTransactions(),
    getEthTotalPrizePool(),
    getArbTotalPrizePool(),
    Promise.resolve(0),
  ]);

  res.status(200).json({
    totalTransactions,
    ethPool,
    arbPool,
    solPool,
  } as RewardPoolRes);
};

export default handler;
