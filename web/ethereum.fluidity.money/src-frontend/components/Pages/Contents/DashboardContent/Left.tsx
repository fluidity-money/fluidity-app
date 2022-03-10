import Button from "components/Button";
import Header from "components/Header";
import { useHistory } from 'react-router-dom';
import Routes from "util/api/types";
import { formatAmount } from "util/amounts";

type left = {
  rewardPool: Routes['/prize-pool']
};

const Left = ({ rewardPool }: left) => {
    const history = useHistory();
    const rewardPoolAmount = formatAmount(rewardPool.amount, 2);

    return (
        <div className="flex column flex-space-between">
            <Header type="primary" className="reward-pool-header">Reward Pool</Header>
            <h1 className="prize">${ rewardPoolAmount }</h1>
            <div className="btn-component">
                <Button
                    label="Fluidify your money"
                    goto={() => { history.push('/') }}
                    theme={"primary-button"}
                    className="reward-pool-button"
                />
            </div>
        </div>
    );
};

export default Left;
