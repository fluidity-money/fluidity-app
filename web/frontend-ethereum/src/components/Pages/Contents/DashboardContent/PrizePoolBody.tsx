import LeftPool from "./Left";
import RightPool from "./Right";
import Routes from "util/api/types";

type rewardPool = {
  pastWinnings: Routes['/past-winnings'],
  rewardPool: Routes['/prize-pool']
};

const PrizePoolBody = ({ pastWinnings, rewardPool }: rewardPool) =>
  <div className="prize-box-container flex flex-space-evenly">
    <LeftPool rewardPool={rewardPool} />
    <RightPool pastWinnings={pastWinnings} />
  </div>;

export default PrizePoolBody;
