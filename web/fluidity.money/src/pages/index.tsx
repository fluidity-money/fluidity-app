// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { getEthTotalPrizePool } from "data/ethereum/prizePool";
import { GetStaticProps } from "next";
import LandingPage from "pageBody/LandingPage";

export type IPropPools = {
    ethPool: number;
    solPool: number;
}

export default LandingPage;

export const getStaticProps = async () => {

    const ethPool: number = await getEthTotalPrizePool(process.env.FLU_ETH_RPC_HTTP);
    const solPool: number = 0;
    const res :IPropPools = {ethPool, solPool};
    const pools = JSON.stringify(res);
    return {
      props: {
        pools
      },
    }
  }