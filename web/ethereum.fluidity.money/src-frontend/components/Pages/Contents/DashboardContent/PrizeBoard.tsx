import InfoGrid from "components/Pages/Contents/DashboardContent/InfoGrid";
import Header from "components/Header";
import Routes from "util/api/types";

type prizeBoard = {
  prizeBoard: Routes['/prize-board']
}

const PrizeBoard = ({ prizeBoard }: prizeBoard) => {
    return (
        <div className="prize-board-container py-2-t ">
            <Header type="primary" className="reward-pool-header">
              Prize Board
            </Header>

            <div className="prize-board-table-container py-2">
              <InfoGrid prizeBoard={ prizeBoard }/>
            </div>
        </div>
    );
};

export default PrizeBoard;
