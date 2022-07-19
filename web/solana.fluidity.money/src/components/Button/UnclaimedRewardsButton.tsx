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
