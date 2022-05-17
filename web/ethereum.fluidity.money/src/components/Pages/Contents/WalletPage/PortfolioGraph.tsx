import WalletChart from "components/Charts/WalletChart";
import TimeSelector from "components/Charts/TimeSelector";
import { chainIdFromEnv } from "util/chainId";

const PortfolioGraph = () => {
  const aurora = chainIdFromEnv() === 1313161554 ? "--aurora" : "";

  return (
    <div className="portfolio-graph">
      <div className={`portfolio-graph-title primary-text${aurora}`}>
        My Portfolio
      </div>
      <div className="portfolio-graph-selector">
        <TimeSelector />
      </div>
      <div className={`portfolio-value secondary-text${aurora}`}>0</div>
      <div className="wallet-chart">
        <WalletChart data={[]} />
      </div>
    </div>
  );
};

export default PortfolioGraph;
