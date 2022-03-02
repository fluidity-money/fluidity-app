import CurrencyListing from "./CurrencyListing";
import DoughnutGraph from "components/Charts/DoughnutChart";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import getWalletSPLStatus from "util/getWalletSPLStatus";
import { walletDataType } from "util/getWalletSPLStatus"
import _ from 'lodash';
import {useSolana} from "@saberhq/use-solana";
import {useFluidToken} from "util/hooks";

const CurrencyBreakdown = () => {
  // Accumulates token names
  const [colours, setColours] = useState<string[]>([]);
  const [walletData, setWalletData] = useState<walletDataType[]>([]);
  const [walletTypes, setWalletTypes] = useState<string[]>([]);
  const [walletAmounts, setWalletAmounts] = useState<string[]>([]);
  const sol = useSolana();
  const tokens = useFluidToken();

  // Renders out Wallet Token Data if signer connected
  useEffect(() => {
    if (sol.connected && tokens) 
      getWalletSPLStatus(sol, tokens).then(status => setWalletData(status));
    else {
      // Render no wallet data case here
    }
  },[sol.connected, tokens])

  useEffect(() => {
    if (walletData.length == 0) {
      return;
    }

    // Distribute walletData for graph render
    setWalletTypes(_.map(walletData, 'type'));
    setWalletAmounts(_.map(walletData, 'amount'));
    setColours(_.map(walletData, 'colour'));
  }, [walletData]);

  const renderedCurrencyList = walletData.map((token, index) => {
    const currencyType = token.type.toString();
    return <CurrencyListing currency={currencyType} amount={token.amount} key={token.type + index}></CurrencyListing>
  })

    const Donut = useMemo(() =>
    <DoughnutGraph
      data={walletAmounts.length !== 0 ? walletAmounts : ["0"]}
      labels={walletTypes.length !== 0 ? walletTypes : ["N/A"]}
      colours={colours.length !== 0 ? colours : ["rgb(0,0,0)"]}
    />

    , [walletAmounts, walletTypes, colours]);


  // Checks to see if the user's wallet is empty
  return ( // (walletData.length !== 0) ? (
    <div className="currency-breakdown">
      <div className="portfolio-graph-title primary-text">
        Account Overview
      </div>
      <div className="doughnut-container">
        {Donut}
      </div>
      <div className="currency-list">
        {renderedCurrencyList}
      </div>
    </div>
  ) 
  // : (
  //   <div className="currency-breakdown">
  //     <div className="portfolio-graph-title primary-text">
  //       Account Overview
  //     </div>
  //     <div className="currency-walletempty-container">¯\_(ツ)_/¯  Insufficient wallet balance  ¯\_(ツ)_/¯</div>
  //   </div>)
};

export default CurrencyBreakdown;
