import CurrencyListing from "./CurrencyListing";
import DoughnutGraph from "components/Charts/DoughnutChart";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import getWalletERC20Status from "util/getWalletERC20Status";
import { walletDataType } from "util/getWalletERC20Status";
import { useSigner } from "util/hooks";
import _ from "lodash";
import { theme } from "util/appTheme";

const CurrencyBreakdown = () => {
  // Accumulates token names
  const [colours, setColours] = useState<string[]>([]);
  const [walletData, setWalletData] = useState<walletDataType[]>([]);
  const [walletTypes, setWalletTypes] = useState<string[]>([]);
  const [walletAmounts, setWalletAmounts] = useState<string[]>([]);
  const signer = useSigner();

  // Renders out Wallet Token Data if signer connected
  useEffect(() => {
    if (signer)
      getWalletERC20Status(signer).then((status) => setWalletData(status));
    else {
      // Render no wallet data case here
    }
  }, [signer?.provider]);

  useEffect(() => {
    if (walletData.length == 0) {
      return;
    }

    // Distribute walletData for graph render
    setWalletTypes(_.map(walletData, "type"));
    setWalletAmounts(_.map(walletData, "amount"));
    setColours(_.map(walletData, "colour"));
  }, [walletData]);

  const renderedCurrencyList = walletData.map((token, index) => {
    const currencyType = token.type.toString();

    return (
      <CurrencyListing
        currency={currencyType}
        amount={token.amount}
        key={token.type + index}
      />
    );
  });

  const Donut = useMemo(
    () => (
      <DoughnutGraph
        data={walletAmounts.length !== 0 ? walletAmounts : ["0"]}
        labels={walletTypes.length !== 0 ? walletTypes : ["N/A"]}
        colours={colours.length !== 0 ? colours : ["rgb(0,0,0)"]}
      />
    ),

    [walletAmounts, walletTypes, colours]
  );

  // Checks to see if the user's wallet is empty
  return (
    <div className="currency-breakdown">
      <div className={`portfolio-graph-title primary-text${theme}`}>
        Account Overview
      </div>

      <div className="doughnut-container">{Donut}</div>

      <div className="currency-list">{renderedCurrencyList}</div>
      {walletData.length === 0 ? (
        <div className={`primary-text${theme}`}>Your wallet is empty</div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CurrencyBreakdown;
