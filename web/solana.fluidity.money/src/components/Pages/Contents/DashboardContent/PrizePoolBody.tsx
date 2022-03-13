import LeftPool from "./Left";
import RightPool from "./Right";
import Routes from "util/api/types";

type prizePool = {
  pastWinnings: Routes['/past-winnings'],
  prizePool: Routes['/prize-pool']
};

const PrizePoolBody = ({pastWinnings, prizePool}: prizePool) =>
  <div className="reward-box-container flex flex-space-evenly">
    <LeftPool prizePool={prizePool} />
    <RightPool pastWinnings={pastWinnings} />
  </div>;

export default PrizePoolBody;

