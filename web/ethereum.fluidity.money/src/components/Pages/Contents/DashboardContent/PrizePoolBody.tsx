// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import LeftPool from "./Left";
import RightPool from "./Right";
import Routes from "util/api/types";

type rewardPool = {
  pastWinnings: Routes['/past-winnings'],
  rewardPool: Routes['/prize-pool']
};

const PrizePoolBody = ({ pastWinnings, rewardPool }: rewardPool) =>
  <div className="prize-box-container flex flex-space-evenly">
    <LeftPool rewardPool={rewardPool} />
    <RightPool pastWinnings={pastWinnings} />
  </div>;

export default PrizePoolBody;
