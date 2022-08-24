// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import InfoGrid from "components/Pages/Contents/DashboardContent/InfoGrid";
import Header from "components/Header";
import Routes from "util/api/types";

type prizeBoard = {
  prizeBoard: Routes["/prize-board"];
};

const PrizeBoard = ({ prizeBoard }: prizeBoard) => {
  return (
    <div className="reward-board-container py-2-t ">
      <Header type="primary" className="reward-pool-header">
        Reward Board
      </Header>

      <div className="reward-board-table-container py-2">
        <InfoGrid prizeBoard={prizeBoard} />
      </div>
    </div>
  );
};

export default PrizeBoard;
