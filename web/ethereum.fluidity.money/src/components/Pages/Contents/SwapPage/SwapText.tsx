import React from "react";
import Header from "components/Header";
import ChainId, { chainIdFromEnv } from "util/chainId";

const SwapText = () => {
  return (
    <div className="flex column flex-space-evenly swap-text-container">
      <Header className="swap-text-header" type="primary">
        Turn your stable
      </Header>
      <Header className="swap-text-header" type="primary">
        coins into
      </Header>
      <Header className="swap-text-header" type="primary">
        $FLUID
      </Header>
      <div
        className={
          chainIdFromEnv() === ChainId.AuroraMainnet
            ? "secondary-text--aurora swap-text-secondary my-2-t"
            : "secondary-text swap-text-secondary my-2-t"
        }
      >
        Fluid dollars reward the sender and receiver just for using them
      </div>
    </div>
  );
};

export default SwapText;
