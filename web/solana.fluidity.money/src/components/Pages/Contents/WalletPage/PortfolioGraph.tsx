// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import WalletChart from "components/Charts/WalletChart";
import TimeSelector from "components/Charts/TimeSelector";

const PortfolioGraph = () => {
  return (
    <div className="portfolio-graph">
      <div className="portfolio-graph-title primary-text">
        My Portfolio
      </div>
      <div className="portfolio-graph-selector">
        <TimeSelector />
      </div>
      <div className="portfolio-value secondary-text">
        0
      </div>
      <div className="wallet-chart">
        <WalletChart data={[]} />
      </div>
    </div>
  );
};

export default PortfolioGraph;
