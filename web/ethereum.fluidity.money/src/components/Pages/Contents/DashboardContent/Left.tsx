// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import Button from "components/Button";
import Header from "components/Header";
import { useHistory } from "react-router-dom";
import Routes from "util/api/types";
import { appTheme } from "util/appTheme";

type left = {
  rewardPool: Routes["/prize-pool"];
};

const Left = ({ rewardPool }: left) => {
  const history = useHistory();

  return (
    <div className="reward-pool-total-container">
      <Header type="primary" className="reward-pool-header">
        Reward Pool
      </Header>
      <h1 className={`prize${appTheme}`}>
        {rewardPool.amount &&
          parseFloat(rewardPool.amount).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
      </h1>
      <div className="btn-component">
        <Button
          label="Fluidify your money"
          goto={() => {
            history.push("/");
          }}
          theme={`primary-button${appTheme}`}
          className="reward-pool-button"
        />
      </div>
    </div>
  );
};

export default Left;
