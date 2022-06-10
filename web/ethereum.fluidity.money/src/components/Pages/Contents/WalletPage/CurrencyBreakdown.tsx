import CurrencyListing from "./CurrencyListing";
import DoughnutGraph from "components/Charts/DoughnutChart";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import getWalletERC20Status from "util/getWalletERC20Status";
import { walletDataType } from "util/getWalletERC20Status";
import { useSigner } from "util/hooks";
import _ from "lodash";
import { appTheme } from "util/appTheme";
import ToggleButton from "components/Button/ToggleButton";

const CurrencyBreakdown = () => {
  // Accumulates token names
  const [walletData, setWalletData] = useState<walletDataType[]>([]);
  const [colours, setColours] = useState<string[]>([]);
  const [walletTypes, setWalletTypes] = useState<string[]>([]);
  const [walletAmounts, setWalletAmounts] = useState<string[]>([]);
  const [fluidColours, setFluidColours] = useState<string[]>([]);
  const [fluidWalletTypes, setFluidWalletTypes] = useState<string[]>([]);
  const [fluidWalletAmounts, setFluidWalletAmounts] = useState<string[]>([]);
  const signer = useSigner();
  // used to toggle which chart and currencies are displayed
  const [fluid, setFluid] = useState(true);

  // Renders out Wallet Token Data if signer connected
  useEffect(() => {
    if (signer)
      getWalletERC20Status(signer).then((status) => setWalletData(status));
    else {
      // Render no wallet data case here
    }
  }, [signer?.provider]);

  const filterFluid = () => {
    return walletData.filter((token) => token.type.startsWith("f"));
  };

  const filterRegular = () => {
    return walletData.filter((token) => !token.type.startsWith("f"));
  };

  const distributeWalletData = () => {
    setWalletTypes(_.map(filterRegular(), "type"));
    setWalletAmounts(_.map(filterRegular(), "amount"));
    setColours(_.map(filterRegular(), "colour"));
    setFluidWalletTypes(_.map(filterFluid(), "type"));
    setFluidWalletAmounts(_.map(filterFluid(), "amount"));
    setFluidColours(_.map(filterFluid(), "colour"));
  };

  useEffect(() => {
    if (walletData.length == 0) {
      return;
    }
    // distributes wallet data for fluid and non fluid donut charts
    distributeWalletData();
  }, [walletData]);

  // displays currency listing based on filtered walletData
  const currencies = fluid ? filterFluid() : filterRegular();
  const renderedCurrencyList = currencies.map((token, index) => {
    const currencyType = token.type.toString();

    return (
      <CurrencyListing
        currency={currencyType}
        amount={token.amount}
        key={token.type + index}
      />
    );
  });

  // calculates total wallet amount
  const total = useMemo(() => {
    return walletData
      .reduce((previous, current) => previous + Number(current.amount), 0)
      .toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
  }, [walletData]);

  const DonutFluid = useMemo(
    () => (
      <DoughnutGraph
        data={fluidWalletAmounts.length !== 0 ? fluidWalletAmounts : ["0"]}
        labels={fluidWalletTypes.length !== 0 ? fluidWalletTypes : ["N/A"]}
        colours={fluidColours.length !== 0 ? fluidColours : ["rgb(0,0,0)"]}
      />
    ),

    [walletAmounts, walletTypes, colours]
  );

  const DonutRegular = useMemo(
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
      <div className={`portfolio-graph-title primary-text${appTheme}`}>
        Account Overview
      </div>

      <div className="yield-graph">
        <div className={`primary-text${appTheme}`}>
          Total Fluid Yield Rewarded
        </div>
      </div>

      <div className="wallet-overview">
        <div className={`primary-text${appTheme}`}>Wallet Overview</div>

        <div className="overview-items">
          <div className="chart-items">
            <div className="doughnut-container">
              <div className="total">
                <div className="white-primary-text">Total</div>
                <div className="white-primary-text">{total}</div>
              </div>
              {fluid ? DonutFluid : DonutRegular}
            </div>
            <div className="toggle-container">
              <div className={fluid ? "white-primary-text" : "primary-text"}>
                Regular
              </div>
              <ToggleButton toggled={fluid} toggle={setFluid} />
              <div className={fluid ? "primary-text" : "white-primary-text"}>
                Fluid
              </div>
            </div>
          </div>
          <div className="currency-list">{renderedCurrencyList}</div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyBreakdown;
