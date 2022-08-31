// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import React from "react";

const UnclaimedRewardsbutton = () => {
  return (
    <>
      <div className={`unclaimed-rewards-button`} onClick={() => {}}>
        <div className="unclaimed-button-left">
          <img
            className="unclaimed-image"
            src={"/img/rewards.svg"}
            alt="rewards icon"
          />
          <div>Total Unclaimed Rewards</div>
        </div>
        <div className="unclaimed-button-right">
          <div className="primary-text">USD 52.30</div>
          <img
            className="chevron-right"
            src={"/img/chevronDown.svg"}
            alt="chevron right"
          />
        </div>
      </div>
    </>
  );
};

export default UnclaimedRewardsbutton;
