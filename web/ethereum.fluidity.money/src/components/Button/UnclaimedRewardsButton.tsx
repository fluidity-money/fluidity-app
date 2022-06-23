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
