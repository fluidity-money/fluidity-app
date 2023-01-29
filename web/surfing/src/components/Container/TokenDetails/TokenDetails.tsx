// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { LabelledValue, Text, LinkButton, LineChart } from "~/components";
import { numberToMonetaryString } from "~/util";
import styles from "./TokenDetails.module.scss";

type ITokenDetails = Partial<HTMLDivElement> & {
  topPrize: number,
  avgPrize: number,
  topAssetPrize: number,
  rewards: Array<{
    desc: string;
    value: number;
    reward: number;
    transaction: string;
  }>
}

const TokenDetails = ({
  topPrize,
  avgPrize,
  topAssetPrize,
  rewards,
}: ITokenDetails) => (
  <div className={`${styles["token-details-container"]}`}>
    <Text size="md" className={styles["vertical-text"]}>LATEST ACTIVITY</Text>

    {/* Prize & Activity */}
    <div >
      {/* Prize */}
      <div >
        <div>
          <Text size="xl" prominent>{numberToMonetaryString(topPrize)}</Text>
          <Text size={"lg"}>Your top prize</Text>
        </div>
        <div>
          <Text size="xl" prominent>{numberToMonetaryString(avgPrize)}</Text>
          <Text size={"lg"}>Your avg. prize</Text>
        </div>
        <div>
          <Text size="xl" prominent>{numberToMonetaryString(topAssetPrize)}</Text>
          <Text size={"lg"}>Top asset prize</Text>
        </div>
      </div>

      {/* Activity */}
      <table >
        <thead>
          <tr>
            <th>Activity</th>
            <th>Value</th>
            <th>Reward</th>
            <th>Transaction</th>
          </tr>
        </thead>
        { rewards.length && (
          <tbody>
            {rewards.slice(0,3).map(({desc, value, reward, transaction}) => (
              <>
                <tr>
                  <td>{desc}</td>
                  <td>{numberToMonetaryString(value)}</td>
                  <td>{numberToMonetaryString(reward)}</td>
                  <td>{transaction}</td>
                </tr>
                <hr />
              </>
            ))}
          </tbody>
        )}
        {!rewards.length && (
          <Text>No Recent Activity Found</Text>        
        )} 
      </table>
    </div>

    {/* Reward Graph */}
    <div style={{height: "100%"}}>
      <LineChart 
        datum={rewards.map((r,i) => ({...r, i:i}))}
        xLabel={""}
        yLabel={""}
        lineLabel={""}
        accessors={{
          xAccessor: ({i}: any) => i,
          yAccessor: ({reward}: any) => reward,
        }}
        tooltip={() => (<></>)}
        />
    </div>

    <LinkButton type="internal" size="medium" handleClick={() => 1} >Full History</LinkButton>
  </div>
);

export default TokenDetails;
