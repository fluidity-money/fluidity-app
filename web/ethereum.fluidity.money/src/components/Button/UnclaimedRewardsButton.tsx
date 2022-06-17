import { useState } from "react";
import { appTheme } from "util/appTheme";

const UnclaimedRewardsbutton = () => {
  return (
    <>
      <div className={`unclaimed-rewards-button${appTheme}`} onClick={() => {}}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            style={{ width: 41, margin: "0 0 5px 0" }}
            src={"/img/rewards.svg"}
            alt="eth icon"
          />
          <div className="">Total Unclaimed Rewards</div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
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
