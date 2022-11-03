// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import LeftPool from "./Left";
import RightPool from "./Right";
import Routes from "util/api/types";

type prizePool = {
  pastWinnings: Routes['/past-winnings'],
  prizePool: Routes['/prize-pool']
};

const PrizePoolBody = ({pastWinnings, prizePool}: prizePool) =>
  <div className="reward-box-container flex flex-space-evenly">
    <LeftPool prizePool={prizePool} />
    <RightPool pastWinnings={pastWinnings} />
  </div>;

export default PrizePoolBody;

