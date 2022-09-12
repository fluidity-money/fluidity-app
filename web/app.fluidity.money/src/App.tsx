// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import GetThatMoney from "./screens/GetThatMoney";

const unclaimedPrizes = 1000,
  fluidAssetName = "fUSDC",
  amountWonFluid = 1337,
  amountWonUsd = 1997,
  totalBalanceFluid = 1000,
  totalBalanceUsd = 1000;

export default () =>
  <Router>
    <div className="App">
      <Routes>
        <Route path="/" element={<GetThatMoney
          unclaimedPrizes={ unclaimedPrizes }
          fluidAssetName={ fluidAssetName }
          amountWonFluid={ amountWonFluid }
          amountWonUsd={ amountWonUsd }
          totalBalanceFluid={ totalBalanceFluid }
          totalBalanceUsd={ totalBalanceUsd } />} />
      </Routes>
    </div>
  </Router>
