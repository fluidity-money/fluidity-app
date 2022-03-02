import Button from "components/Button";
import Header from "components/Header";
import { useHistory } from 'react-router-dom';
import Routes from "util/api/types";

type left = {
  prizePool: Routes['/prize-pool']
};

const toDecimals = (amount: string | number, decimals: number) => {
  if (!amount) return amount;

  // number
  if (typeof amount === 'number')
    return amount.toFixed(decimals);

  // string
  const [pre, post] = amount.split('.');
  return post ? pre + '.' + post.slice(0, decimals) : pre;
}

const Left = ({ prizePool }: left) => {
    const history = useHistory();
    const prizePoolAmount = toDecimals(prizePool.amount, 2);

    return (
      <div className="flex column flex-space-between">
        <Header type="primary" className="reward-pool-header">Reward Pool</Header>
          <h1 className="reward">${ prizePoolAmount }</h1>
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

