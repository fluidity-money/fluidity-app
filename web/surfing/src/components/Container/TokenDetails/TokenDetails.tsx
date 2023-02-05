// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { LabelledValue, Text, LinkButton, LineChart, DataTable } from "~/components";
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
  <div className={styles.TokenDetails}>
    {/* Prize & Activity */}
    <div className={styles.details}>
      {/* Prize */}
      <div className={styles.prizes}>
        <div className={styles.prize}>
          <Text size="lg" prominent>{numberToMonetaryString(topPrize.winning_amount)}</Text>
          <Text >Your top prize</Text>
        </div>
        <div className={styles.prize}>
          <Text size="lg" prominent>{numberToMonetaryString(avgPrize)}</Text>
          <Text>Your avg. prize</Text>
        </div>
        <div className={styles.prize}>
          <Text size="lg" prominent>{numberToMonetaryString(topAssetPrize.winning_amount)}</Text>
          <Text >Top asset prize</Text>
        </div>
      </div>

      {/* Activity */}
      <div className={styles.activity}>
        <Text size="sm" className={styles["vertical-text"]}>LATEST ACTIVITY</Text>
        <table >
          <thead>
            <tr>
              <th><Text size='xs' bold >Activity</Text></th>
              <th><Text size='xs' bold >Value</Text></th>
              <th><Text size='xs' bold >Reward</Text></th>
              <th><Text size='xs' bold >Transaction</Text></th>
            </tr>
          </thead>
          { !!activity.length && (
            <tbody>
              {activity.slice(0,3).map(({desc, value, reward, transaction}) => (
                <tr>
                  <td><Text>{desc}</Text></td>
                  <td><Text>{numberToMonetaryString(value)}</Text></td>
                  <td><Text prominent>{numberToMonetaryString(reward)}</Text></td>
                  <td><Text><a href={'#'}>{trimAddress(transaction)}</a></Text></td>
                </tr>
              ))}
            </tbody>
          )}
          {!activity.length && (
            <Text>No recent activity found.</Text>        
          )} 
        </table>
      </div>

      <LinkButton type="internal" size="small" handleClick={() => 1} >Full History</LinkButton>
    </div>
    <div className={styles.graph}>
      <LineChart 
        datum={activity.map((a, i) => {
          return {
            x: i,
            y: a.reward,
          }
        })}
        xLabel={""}
        yLabel={""}
        lineLabel={""}
        accessors={{
          xAccessor: ({x}: any) => x.x,
          yAccessor: ({x}: any) => x.y,
        }}
        tooltip={() => (<></>)}
      />
    </div>
  </div>
);

// export const getWalletValueAtTransaction = ()

export default TokenDetails;
