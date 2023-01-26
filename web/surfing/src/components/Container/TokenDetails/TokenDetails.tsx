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
          <Text size="xl" prominent>{numberToMonetaryString(topPrize)}</Text>
          <Text size={"lg"}>Your avg. prize</Text>
        </div>
        <div>
          <Text size="xl" prominent>{numberToMonetaryString(topPrize)}</Text>
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
        <tbody>
          {
          rewards.length ? rewards.map(({desc, value, reward, transaction}) => (
            <>
  <tr>
    <td>{desc}</td>
    <td>{numberToMonetaryString(value)}</td>
    <td>{numberToMonetaryString(reward)}</td>
    <td>{transaction}</td>
  </tr>
            <hr />
</>
)) : <Text>No Recent Activity Found</Text>
        }
        </tbody>
      </table>
    </div>

    {/* Reward Graph */}
    <div style={{height: "100%"}}>
  // data: Datum[];
  // xLabel: string;
  // yLabel: string;
  // lineLabel: string;
  // accessors: {
  //   xAccessor: (d: Datum) => number | Date;
  //   yAccessor: (d: Datum) => number;
  // };
  // renderTooltip: ({ datum }: { datum: Datum } & Element) => React.ReactNode;
      <LineChart 
        datum={rewards.map((r,i) => ({...r, i:i}))}
  xLabel={""}
  yLabel={""}
  lineLabel={""}
  accessors={{
    xAccessor: ({i}) => i,
    yAccessor: ({reward}) => reward,
  }}
  tooltip={() => <></>}
        />

    </div>

    <LinkButton type="internal" size="medium" handleClick={() => 1} >Full History</LinkButton>
  </div>
);

export default TokenDetails;
