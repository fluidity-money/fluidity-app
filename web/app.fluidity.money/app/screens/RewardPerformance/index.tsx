import type { Chain } from "~/util/chainUtils/chains";

import { useState } from "react";

import TransactionTable from "~/screens/TransactionTable";

import {
  Text,
  Heading,
  ManualCarousel,
  numberToMonetaryString,
} from "@fluidity-money/surfing";
import { ProviderCard, LabelledValue } from "~/components"

export type Transaction = {
  sender: string;
  receiver: string;
  timestamp: number;
  value: number;
  currency: string;
};

export type Rewarder = {
  iconUrl: string;
  name: string;
  prize: number;
  avgPrize: number;
}


type IRewardPerformance = {
  transactions: Transaction[];
  count: number;
  page: number;
  network: Chain;
  rewarders: Rewarder[];
}

const performanceTimeFrames = [
  "All time",
  "Last week",
  "Last month",
  "This year",
]
  

const RewardPerformance = ({transactions, count, page, network, rewarders}: IRewardPerformance) => {
  const [ timeFrameIndex, setTimeFrameIndex ] = useState(0);

  return (
    <>
      {/* Reward Performance */}
      <section id="performance">
        <Heading as={"h2"}>
          Reward Performance
        </Heading>
        <div className="graph-ceiling">
          <div className="overlay">
            <div className="statistics-row">
              <div className="statistics-set">
                <LabelledValue label={"Total claimed yield"}>
                  {numberToMonetaryString(29645)}
                </LabelledValue>
              </div>

              <div className="statistics-set">
                <LabelledValue label={"Highest performer"}>
                  fAVAX
                </LabelledValue>
              </div>

              <div className="statistics-set">
                <LabelledValue label={"Total prize pool"}>
                  {numberToMonetaryString(678120)}
                </LabelledValue>
              </div>

              <div className="statistics-set">
                <LabelledValue label={"Fluid Pairs"}>
                  {0}
                </LabelledValue>
              </div>
            </div>
          </div>
          <div>
            <div className="statistics-row">
              {performanceTimeFrames.map((timeFrame, i) => {
                const selectedProps = timeFrameIndex === i ? "selected" : ""
                const classProps = `${selectedProps}`

                return (
                  <button onClick={() => setTimeFrameIndex(i)}>
                    <Text className={classProps}>{timeFrame}</Text>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>


      <section id="table">
        <TransactionTable
          page={page}
          count={count}
          transactions={transactions}
          chain={network}
        />
      </section>
    
      {/* Highest Rewarders - SCOPED OUT FOR NOW */}
      { /*
      <section id="rewarders">
        <Heading as={"h2"}>
          Highest Rewarders
        </Heading>
        <ManualCarousel scrollBar={true} >
          {rewarders.map(rewarder => 
            <ProviderCard 
              iconUrl={rewarder.iconUrl}
              name={rewarder.name}
              prize={rewarder.prize}
              avgPrize={rewarder.avgPrize}
            /> 
          )}
        </ManualCarousel>
        
      </section>
      */ }
    </>
  );
}

export default RewardPerformance;
