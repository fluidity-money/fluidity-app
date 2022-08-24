// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { useState } from "react";
import { appTheme } from "util/appTheme";

const UnclaimedRewardsbutton = () => {
  return (
    <>
      <div className={`unclaimed-rewards-button${appTheme}`} onClick={() => {}}>
        <div className="unclaimed-button-left">
          <img
            className="unclaimed-image"
            src={"/img/rewards.svg"}
            alt="eth icon"
          />
          <div>Total Unclaimed Rewards</div>
        </div>
        <div className="unclaimed-button-right">
          <div style={{ fontFamily: "manrope" }}>USD 52.30</div>
          <img
            className="chevron-right"
            src={"/img/chevronDown.svg"}
            alt="eth icon"
          />
        </div>
      </div>
    </>
  );
};

export default UnclaimedRewardsbutton;
