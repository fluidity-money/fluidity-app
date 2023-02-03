// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { LabelledValue, Text, LinkButton, LineChart } from "~/components";
import { numberToMonetaryString, trimAddress } from "~/util";
import styles from "./TokenDetails.module.scss";

export type ITokenDetails = {
  topPrize: { 
    winning_amount: number
    transaction_hash: string
  }
  avgPrize: number
  topAssetPrize: { 
    winning_amount: number
    transaction_hash: string
  }
  activity: {
    desc: string
    value: number
    reward: number
    transaction: string
  }[]
}


const TokenDetails = ({
  topPrize,
  avgPrize,
  topAssetPrize,
  activity,
}: ITokenDetails) => (
  <div className={`${styles["token-details-container"]}`}>
    <Text size="md" className={styles["vertical-text"]}>LATEST ACTIVITY</Text>

    {/* Prize & Activity */}
    <div >
      {/* Prize */}
      <div >
        <div>
          <Text size="xl" prominent>{numberToMonetaryString(topPrize.winning_amount)}</Text>
          <Text size={"lg"}>Your top prize</Text>
        </div>
        <div>
          <Text size="xl" prominent>{numberToMonetaryString(avgPrize)}</Text>
          <Text size={"lg"}>Your avg. prize</Text>
        </div>
        <div>
          <Text size="xl" prominent>{numberToMonetaryString(topAssetPrize.winning_amount)}</Text>
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
        { activity.length && (
          <tbody>
            {activity.slice(0,3).map(({desc, value, reward, transaction}) => (
              <>
                <tr>
                  <td>{desc}</td>
                  <td>{numberToMonetaryString(value)}</td>
                  <td>{numberToMonetaryString(reward)}</td>
                  <td>{trimAddress(transaction)}</td>
                </tr>
                <hr />
              </>
            ))}
          </tbody>
        )}
        {!activity.length && (
          <Text>No Recent Activity Found</Text>        
        )} 
      </table>
    </div>

    {/* Reward Graph */}
    <div style={{height: "100%"}}>
      <LineChart 
        datum={activity.map((r,i) => ({...r, i:i}))}
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
