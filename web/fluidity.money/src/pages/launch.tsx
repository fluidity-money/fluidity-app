// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { getEthTotalPrizePool, getTotalTransactions } from "data/ethereum";
import LandingPage from "pageBody/LandingPage";

export type IPropOnChainData = {
    ethPool: number;
    solPool: number;
		totalTransactions: number;
}

export const getServerSideProps = async () => {

		const totalTransactions = await getTotalTransactions()
		
    const ethPool: number = await getEthTotalPrizePool();
    const solPool: number = 0;
    const res :IPropOnChainData = {ethPool, solPool, totalTransactions};
    const data = JSON.stringify(res);
    return {
        props: {
        data
        },
    }
}

export default LandingPage;
