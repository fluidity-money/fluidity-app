// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import React from "react";
import styles from "./RewardsInfo.module.scss";

import DataTable from "../../components/DataTable";

const RewardsInfo = () => {
  const data = React.useMemo(
    () => [
      {
        img: 'https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png',
        action: 'Sent fUSDC',
        val: '$8.13',
        win: '$0.10',
        key: '9303...0393',
        time: '10mins ago',
        type: 'NFT'
      },
      {
        img: 'https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png',
        action: 'Sent fUSDC',
        val: '$8.13',
        win: '$0.10',
        key: '9303...0393',
        time: '10mins ago',
        type: 'DEX'
      },
      {
        img: 'https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png',
        action: 'Sent fUSDC',
        val: '$8.13',
        win: '$0.10',
        key: '9303...0393',
        time: '10mins ago',
        type: 'NFT'
      },
      {
        img: 'https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png',
        action: 'Sent fUSDC',
        val: '$8.13',
        win: '$0.10',
        key: '9303...0393',
        time: '10mins ago',
        type: 'DeFi'
      },
      {
        img: 'https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png',
        action: 'Sent fUSDC',
        val: '$8.13',
        win: '$0.10',
        key: '9303...0393',
        time: '10mins ago',
        type: 'NFT'
      },
      {
        img: 'https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png',
        action: 'Sent fUSDC',
        val: '$8.13',
        win: '$0.10',
        key: '9303...0393',
        time: '10mins ago',
        type: 'DEX'
      },
      {
        img: 'https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png',
        action: 'Sent fUSDC',
        val: '$8.13',
        win: '$0.10',
        key: '9303...0393',
        time: '10mins ago',
        type: 'NFT'
      },
      {
        img: 'https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png',
        action: 'Sent fUSDC',
        val: '$8.13',
        win: '$0.10',
        key: '9303...0393',
        time: '10mins ago',
        type: 'DeFi'
      },
      {
        img: 'https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png',
        action: 'Sent fUSDC',
        val: '$8.13',
        win: '$0.10',
        key: '9303...0393',
        time: '10mins ago',
        type: 'NFT'
      },
      {
        img: 'https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png',
        action: 'Sent fUSDC',
        val: '$8.13',
        win: '$0.10',
        key: '9303...0393',
        time: '10mins ago',
        type: 'DEX'
      },
      {
        img: 'https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png',
        action: 'Sent fUSDC',
        val: '$8.13',
        win: '$0.10',
        key: '9303...0393',
        time: '10mins ago',
        type: 'NFT'
      },
      {
        img: 'https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png',
        action: 'Sent fUSDC',
        val: '$8.13',
        win: '$0.10',
        key: '9303...0393',
        time: '10mins ago',
        type: 'DeFi'
      },
      {
        img: 'https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png',
        action: 'Sent fUSDC',
        val: '$8.13',
        win: '$0.10',
        key: '9303...0393',
        time: '10mins ago',
        type: 'NFT'
      },
      {
        img: 'https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png',
        action: 'Sent fUSDC',
        val: '$8.13',
        win: '$0.10',
        key: '9303...0393',
        time: '10mins ago',
        type: 'DEX'
      },
      {
        img: 'https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png',
        action: 'Sent fUSDC',
        val: '$8.13',
        win: '$0.10',
        key: '9303...0393',
        time: '10mins ago',
        type: 'DeFi'
      },
      {
        img: 'https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png',
        action: 'Sent fUSDC',
        val: '$8.13',
        win: '$0.10',
        key: '9303...0393',
        time: '10mins ago',
        type: 'NFT'
      },
      {
        img: 'https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png',
        action: 'Sent fUSDC',
        val: '$8.13',
        win: '$0.10',
        key: '9303...0393',
        time: '10mins ago',
        type: 'DeFi'
      },
    ],
    []
  )

  const columns = React.useMemo(
    () => [
      {
        Header: 'ACTIVITY',
        accessor: 'img',
        Cell: (props : any) => (
          <><img
            src={props.row.original.img}
            width={20}
            alt='coin' /> <span>{props.row.original.action}</span>
            </> 
        )
      },
      {
        Header: 'VALUE',
        accessor: 'val',
      },
      {
        Header: 'REWARD',
        accessor: 'win',
      },
      {
        Header: 'ACCOUNT',
        accessor: 'key',
      },
      {
        Header: 'TIME',
        accessor: 'time',
      },
      {
        Header: '',
        accessor: 'type',
      },
    ],
    []
  )

  return (
    <div className={styles.container}>
      <h1>Reward Distribution</h1>
      <div>
        <DataTable name={'Transactions'} filterData={['ALL', 'DEX', 'NFT', 'DeFi']} columns={columns} data={data} rowSize={5} />  
      </div>
    </div>
  )
};

export default RewardsInfo;
