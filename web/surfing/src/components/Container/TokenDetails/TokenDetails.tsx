// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { motion } from "framer-motion";
import { Text, LinkButton, LineChart } from "~/components";
import { numberToMonetaryString, trimAddress, useViewport } from "~/util";
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
    totalWalletValue: number
  }[]
  onClickFullHistory: () => void
}

const getTxExplorerLink = (chain: 'ethereum' | 'solana', address: string) =>
  chain === "ethereum"
    ? `https://etherscan.io/tx/${address}`
    : `https://explorer.solana.com/tx/${address}`;

const TokenDetails = ({
  topPrize,
  avgPrize,
  topAssetPrize,
  activity,
  onClickFullHistory,
}: ITokenDetails) => {
  const mobileBreakpoint = 1200
  const { width } = useViewport()
  const isMobile = width < mobileBreakpoint
  
  return (
    <div className={`${styles.TokenDetails} ${isMobile ? styles.isMobile : ''}`}>
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
          {!isMobile &&
            <div className={styles.prize}>
              <Text holo size="lg" prominent>{numberToMonetaryString(topAssetPrize.winning_amount)}</Text>
              <Text >Top asset prize</Text>
            </div>
          }
        </div>

        {/* Activity */}
        <div className={styles.activity}>
          {!isMobile && <Text size="sm" className={styles["vertical-text"]}>LATEST ACTIVITY</Text>}
          <table >
            <thead>
              <tr>
                <th><Text size='xs' bold >Activity</Text></th>
                {
                  !!activity.length && (
                    <>
                      {!isMobile && <th><Text size='xs' bold >Value</Text></th>}
                      <th><Text size='xs' bold >Reward</Text></th>
                      {!isMobile && <th><Text size='xs' bold >Transaction</Text></th>}
                    </>
                  )
                }
              </tr>
            </thead>
            <tbody>
            { activity.length ? (
                activity.slice(0,3).map(({desc, value, reward, transaction}) => (
                  <tr>
                    <td>
                      <Text>
                      {isMobile ? (<a href={getTxExplorerLink('ethereum', transaction)}>{`${desc} ${numberToMonetaryString(value)}`}</a>) : (<>{desc}</>) }
                      </Text>
                    </td>
                    {!isMobile && <td><Text>{numberToMonetaryString(value)}</Text></td>}
                    <td><Text prominent>{numberToMonetaryString(reward)}</Text></td>
                    {!isMobile && <td><Text><a href={getTxExplorerLink('ethereum', transaction)}>{trimAddress(transaction)}</a></Text></td>}
                  </tr>
                ))
            ) : (
                <tr>
                  <td><Text>No recent activity found.</Text></td>
                </tr>
            )} 
            </tbody>
          </table>
        </div>

        <LinkButton type="internal" size="small" handleClick={onClickFullHistory} >Full History</LinkButton>
      </div>
      <motion.div 
        className={styles.graph}
        initial={{ opacity: 0, }}
        animate={{ opacity: 1, }}
        exit={{ opacity: 0, }}
        transition={{ delay: 0.2, duration: 0.3, ease: 'easeInOut' }}
      >
        <LineChart 
          data={activity.map((a, i) => {
            return {
              x: i,
              y: a.totalWalletValue,
            }
          })}
          lineLabel={"activity"}
          accessors={{
            xAccessor: ({x}: {x: number, y: number}) => x,
            yAccessor: ({y}: {x: number, y: number}) => y,
          }}
          renderTooltip={() => {<></>}}
        />
      </motion.div>
    </div>
  )
};

// export const getWalletValueAtTransaction = ()

export default TokenDetails;
