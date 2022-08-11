import React from "react";
import styles from "./RewardsInfo.module.scss";

import { DataTable } from "../../components/DataTable";

const RewardsInfo = () => {
  const data = React.useMemo(
    () => [
      {
        img: 'https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png',
        action: 'Sent fUSDC',
        val: '$8.13',
        win: '$0.10',
        key: '9303...0393',
        time: '10mins ago'
      },
      {
        img: 'https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png',
        action: 'Sent fUSDC',
        val: '$8.13',
        win: '$0.10',
        key: '9303...0393',
        time: '10mins ago'
      },
      {
        img: 'https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png',
        action: 'Sent fUSDC',
        val: '$8.13',
        win: '$0.10',
        key: '9303...0393',
        time: '10mins ago'
      },
      {
        img: 'https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png',
        action: 'Sent fUSDC',
        val: '$8.13',
        win: '$0.10',
        key: '9303...0393',
        time: '10mins ago'
      },
      {
        img: 'https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png',
        action: 'Sent fUSDC',
        val: '$8.13',
        win: '$0.10',
        key: '9303...0393',
        time: '10mins ago'
      },
      {
        img: 'https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png',
        action: 'Sent fUSDC',
        val: '$8.13',
        win: '$0.10',
        key: '9303...0393',
        time: '10mins ago'
      },
      {
        img: 'https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png',
        action: 'Sent fUSDC',
        val: '$8.13',
        win: '$0.10',
        key: '9303...0393',
        time: '10mins ago'
      },
      {
        img: 'https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png',
        action: 'Sent fUSDC',
        val: '$8.13',
        win: '$0.10',
        key: '9303...0393',
        time: '10mins ago'
      },
      {
        img: 'https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png',
        action: 'Sent fUSDC',
        val: '$8.13',
        win: '$0.10',
        key: '9303...0393',
        time: '10mins ago'
      },
      {
        img: 'https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png',
        action: 'Sent fUSDC',
        val: '$8.13',
        win: '$0.10',
        key: '9303...0393',
        time: '10mins ago'
      },
      {
        img: 'https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png',
        action: 'Sent fUSDC',
        val: '$8.13',
        win: '$0.10',
        key: '9303...0393',
        time: '10mins ago'
      },
      {
        img: 'https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png',
        action: 'Sent fUSDC',
        val: '$8.13',
        win: '$0.10',
        key: '9303...0393',
        time: '10mins ago'
      },
      {
        img: 'https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png',
        action: 'Sent fUSDC',
        val: '$8.13',
        win: '$0.10',
        key: '9303...0393',
        time: '10mins ago'
      },
      {
        img: 'https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png',
        action: 'Sent fUSDC',
        val: '$8.13',
        win: '$0.10',
        key: '9303...0393',
        time: '10mins ago'
      },
      {
        img: 'https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png',
        action: 'Sent fUSDC',
        val: '$8.13',
        win: '$0.10',
        key: '9303...0393',
        time: '10mins ago'
      },
      {
        img: 'https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png',
        action: 'Sent fUSDC',
        val: '$8.13',
        win: '$0.10',
        key: '9303...0393',
        time: '10mins ago'
      },
      {
        img: 'https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png',
        action: 'Sent fUSDC',
        val: '$8.13',
        win: '$0.10',
        key: '9303...0393',
        time: '10mins ago'
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
    ],
    []
  )

  return (
    <div className={styles.container}>
      <h1>Reward Distribution</h1>
      <div>
        <DataTable name={'Transactions'} filterData={['ALL', 'DEX', 'NFT', 'DeFi']} columns={columns} data={data} />  
      </div>
    </div>
  )
};

export default RewardsInfo;
