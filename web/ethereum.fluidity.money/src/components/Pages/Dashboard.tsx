// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import Toolbar from "components/Toolbar";
import { FluidityToolBarTheme as ToolbarContents } from "components/Toolbar/ToolbarContents/FluidityToolBarTheme";
import AppContainer from "components/Styling/AppContainer";
import AppBody from "components/Styling/AppBody";
import PrizePool from "components/Pages/Contents/DashboardContent/PrizePoolBody";
import PrizeBoard from "components/Pages/Contents/DashboardContent/PrizeBoard";
import Routes from "util/api/types";

type dashboard = {
  prizeBoard: Routes['/prize-board'],
  pastWinnings: Routes['/past-winnings'],
  rewardPool: Routes['/prize-pool']
}

const Dashboard = ({ prizeBoard, pastWinnings, rewardPool }: dashboard) => {

    return (
      <AppContainer>
        <Toolbar>
            <ToolbarContents
                selected={
                {options: [true,false,false]}
                }/>
        </Toolbar>

        <AppBody direction="align p-1" alignment="space-between">
                <PrizePool
                  rewardPool={rewardPool}
                  pastWinnings={pastWinnings} />

                <PrizeBoard prizeBoard={prizeBoard} />
        </AppBody>
      </AppContainer>
    );
  };

  export default Dashboard;
