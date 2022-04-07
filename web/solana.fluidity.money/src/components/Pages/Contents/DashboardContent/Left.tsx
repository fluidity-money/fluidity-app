import Button from "components/Button";
import Header from "components/Header";
import { useHistory } from "react-router-dom";
import Routes from "util/api/types";

type left = {
  prizePool: Routes["/prize-pool"];
};

const Left = ({ prizePool }: left) => {
  const history = useHistory();

  return (
    <div className="reward-pool-total-container">
      <Header type="primary" className="reward-pool-header">
        Reward Pool
      </Header>
      <h1 className="reward">
        $
        {prizePool.amount &&
          parseFloat(prizePool.amount).toLocaleString("en", {
            maximumFractionDigits: 2,
          })}
      </h1>
      <div className="btn-component">
        <Button
          label="Fluidify your money"
          goto={() => {
            history.push("/");
          }}
          theme={"primary-button"}
          className="reward-pool-button"
        />
      </div>
    </div>
  );
};

export default Left;
