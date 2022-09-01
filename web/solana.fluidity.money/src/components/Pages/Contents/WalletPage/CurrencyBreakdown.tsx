// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import CurrencyListing from "./CurrencyListing";
import DoughnutGraph from "components/Charts/DoughnutChart";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import getWalletSPLStatus from "util/getWalletSPLStatus";
import { walletDataType } from "util/getWalletSPLStatus";
import _ from "lodash";
import { useSolana } from "@saberhq/use-solana";
import { useFluidToken } from "util/hooks";
import ToggleButton from "components/Button/ToggleButton";
import UnclaimedRewardsbutton from "components/Button/UnclaimedRewardsButton";
import LineGraph from "components/Charts/LineChart";

const CurrencyBreakdown = () => {
  // Accumulates token names
  const [colours, setColours] = useState<string[]>([]);
  const [walletData, setWalletData] = useState<walletDataType[]>([]);
  const [walletTypes, setWalletTypes] = useState<string[]>([]);
  const [walletAmounts, setWalletAmounts] = useState<string[]>([]);
  const [fluidColours, setFluidColours] = useState<string[]>([]);
  const [fluidWalletTypes, setFluidWalletTypes] = useState<string[]>([]);
  const [fluidWalletAmounts, setFluidWalletAmounts] = useState<string[]>([]);
  // used to toggle which chart and currencies are displayed
  const [fluid, setFluid] = useState(true);

  const sol = useSolana();
  const { tokens, fluidTokensList, nonFluidTokensList } = useFluidToken();

  // Renders out Wallet Token Data if signer connected
  useEffect(() => {
    if (sol.connected && tokens) {
      getWalletSPLStatus(sol, tokens, fluidTokensList, nonFluidTokensList).then(
        (status) => setWalletData(status)
      );
    } else {
      // Render no wallet data case here
    }
  }, [fluidTokensList, nonFluidTokensList, sol, sol.connected, tokens]);

  // both filter functions also sort tokens in alphabetical order
  const filterFluid = () => {
    return walletData
      .sort((a, b) => a.type.localeCompare(b.type))
      .filter((token) => token.type.startsWith("f"));
  };

  const filterRegular = () => {
    return walletData
      .sort((a, b) => a.type.localeCompare(b.type))
      .filter((token) => !token.type.startsWith("f"));
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
    if (walletData.length === 0) {
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
     <div className="currency-container">
       <CurrencyListing
         currency={currencyType}
         amount={token.amount}
         key={token.type + index}
       />
     </div>
   );
 });

 // calculates total wallet amount
 const calculateTotal = (tokens: walletDataType[]) => {
   return tokens
     .reduce((previous, current) => previous + Number(current.amount), 0)
     .toLocaleString("en-US", {
       style: "currency",
       currency: "USD",
       minimumFractionDigits: 2,
       maximumFractionDigits: 2,
     });
 };

 // total amount for Fluid assets
 const totalFluid = useMemo(() => calculateTotal(filterFluid()), [walletData]);

 // total amount for Regular assets
 const totalRegular = useMemo(
   () => calculateTotal(filterRegular()),
   [walletData]
 );

 const DonutFluid = useMemo(
   () => (
     <DoughnutGraph
       data={fluidWalletAmounts.length !== 0 ? fluidWalletAmounts : ["0"]}
       labels={fluidWalletTypes.length !== 0 ? fluidWalletTypes : ["N/A"]}
       colours={fluidColours.length !== 0 ? fluidColours : ["rgb(0,0,0)"]}
     />
   ),

   [fluidWalletAmounts, fluidWalletTypes, fluidColours]
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

 const LineChart = useMemo(() => <LineGraph />, []);

 // Checks to see if the user's wallet is empty
 return (
   <div className="currency-breakdown">
     <div className={`portfolio-graph-title white-primary-text`}>
       Account Overview
     </div>

       <div className="overview-items">
         <div className="chart-items">
           <div className="doughnut-container">
             <div className="total">
               <div className="grey-primary-text">Total</div>
               <div className="white-primary-text">
                 {fluid ? totalFluid : totalRegular}
               </div>
             </div>
             {fluid ? DonutFluid : DonutRegular}
           </div>
           <div className="toggle-container margin-top-10">
             <div className={`${fluid ? "grey-primary-text" : "selected-text "} margin-right-10`}>
               Regular
             </div>
             <ToggleButton toggled={fluid} toggle={setFluid} />
             <div className={`${fluid ? "selected-text" : "grey-primary-text"} margin-left-10`}>
               Fluid
             </div>
           </div>
         </div>
         <div className="currency-list">{renderedCurrencyList}</div>
       </div>
     </div>
 );
};

export default CurrencyBreakdown;
