import WalletChart from "components/Charts/WalletChart";
import TimeSelector from "components/Charts/TimeSelector";
import { chainIdFromEnv } from "util/chainId";

const PortfolioGraph = () => {
  return (
    <div className="portfolio-graph">
      <div
        className={
          chainIdFromEnv() === 1313161554
            ? "portfolio-graph-title primary-text--aurora"
            : "portfolio-graph-title primary-text"
        }
      >
        My Portfolio
      </div>
      <div className="portfolio-graph-selector">
        <TimeSelector />
      </div>
      <div className="portfolio-value secondary-text">0</div>
      <div className="wallet-chart">
        <WalletChart data={[]} />
      </div>
    </div>
  );
};

export default PortfolioGraph;
