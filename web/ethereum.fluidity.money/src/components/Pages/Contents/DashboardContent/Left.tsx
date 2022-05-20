import Button from "components/Button";
import Header from "components/Header";
import { useHistory } from "react-router-dom";
import Routes from "util/api/types";
import { theme } from "util/appTheme";
import ChainId, { chainIdFromEnv } from "util/chainId";

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
      <h1 className={`prize${theme}`}>
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
          theme={
            chainIdFromEnv() === ChainId.AuroraMainnet
              ? "primary-button-aurora"
              : "primary-button"
          }
          className="reward-pool-button"
        />
      </div>
    </div>
  );
};

export default Left;
