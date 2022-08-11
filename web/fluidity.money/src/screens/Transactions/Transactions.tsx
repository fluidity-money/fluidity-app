import React from "react";
import styles from "./Transactions.module.scss";

import DataTable from "../../components/DataTable";

const Transactions = () => {
  const data = React.useMemo(
    () => [
      {
        img: ['https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png', 'https://cryptomarketpool.com/wp-content/uploads/2021/07/bnb-1.png'],
        pool: 'USDC / ETH',
        tvl: '$256,000',
        prize: '$2,000,000',
        time: '15 mins ago'
      },
      {
        img: ['https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png', 'https://cryptomarketpool.com/wp-content/uploads/2021/07/bnb-1.png'],
        pool: 'USDC / ETH',
        tvl: '$256,000',
        prize: '$2,000,000',
        time: '15 mins ago'
      },
      {
        img: ['https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png', 'https://cryptomarketpool.com/wp-content/uploads/2021/07/bnb-1.png'],
        pool: 'USDC / ETH',
        tvl: '$256,000',
        prize: '$2,000,000',
        time: '15 mins ago'
      },
      {
        img: ['https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png', 'https://cryptomarketpool.com/wp-content/uploads/2021/07/bnb-1.png'],
        pool: 'USDC / ETH',
        tvl: '$256,000',
        prize: '$2,000,000',
        time: '15 mins ago'
      },
      {
        img: ['https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png', 'https://cryptomarketpool.com/wp-content/uploads/2021/07/bnb-1.png'],
        pool: 'USDC / ETH',
        tvl: '$256,000',
        prize: '$2,000,000',
        time: '15 mins ago'
      },
      {
        img: ['https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png', 'https://cryptomarketpool.com/wp-content/uploads/2021/07/bnb-1.png'],
        pool: 'USDC / ETH',
        tvl: '$256,000',
        prize: '$2,000,000',
        time: '15 mins ago'
      },
      {
        img: ['https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png', 'https://cryptomarketpool.com/wp-content/uploads/2021/07/bnb-1.png'],
        pool: 'USDC / ETH',
        tvl: '$256,000',
        prize: '$2,000,000',
        time: '15 mins ago'
      },
      {
        img: ['https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png', 'https://cryptomarketpool.com/wp-content/uploads/2021/07/bnb-1.png'],
        pool: 'USDC / ETH',
        tvl: '$256,000',
        prize: '$2,000,000',
        time: '15 mins ago'
      },
      {
        img: ['https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png', 'https://cryptomarketpool.com/wp-content/uploads/2021/07/bnb-1.png'],
        pool: 'USDC / ETH',
        tvl: '$256,000',
        prize: '$2,000,000',
        time: '15 mins ago'
      },
      {
        img: ['https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png', 'https://cryptomarketpool.com/wp-content/uploads/2021/07/bnb-1.png'],
        pool: 'USDC / ETH',
        tvl: '$256,000',
        prize: '$2,000,000',
        time: '15 mins ago'
      },
      {
        img: ['https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png', 'https://cryptomarketpool.com/wp-content/uploads/2021/07/bnb-1.png'],
        pool: 'USDC / ETH',
        tvl: '$256,000',
        prize: '$2,000,000',
        time: '15 mins ago'
      },
      {
        img: ['https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png', 'https://cryptomarketpool.com/wp-content/uploads/2021/07/bnb-1.png'],
        pool: 'USDC / ETH',
        tvl: '$256,000',
        prize: '$2,000,000',
        time: '15 mins ago'
      },
      {
        img: ['https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png', 'https://cryptomarketpool.com/wp-content/uploads/2021/07/bnb-1.png'],
        pool: 'USDC / ETH',
        tvl: '$256,000',
        prize: '$2,000,000',
        time: '15 mins ago'
      },
      {
        img: ['https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png', 'https://cryptomarketpool.com/wp-content/uploads/2021/07/bnb-1.png'],
        pool: 'USDC / ETH',
        tvl: '$256,000',
        prize: '$2,000,000',
        time: '15 mins ago'
      },
      {
        img: ['https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png', 'https://cryptomarketpool.com/wp-content/uploads/2021/07/bnb-1.png'],
        pool: 'USDC / ETH',
        tvl: '$256,000',
        prize: '$2,000,000',
        time: '15 mins ago'
      },
      {
        img: ['https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png', 'https://cryptomarketpool.com/wp-content/uploads/2021/07/bnb-1.png'],
        pool: 'USDC / ETH',
        tvl: '$256,000',
        prize: '$2,000,000',
        time: '15 mins ago'
      },
      {
        img: ['https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png', 'https://cryptomarketpool.com/wp-content/uploads/2021/07/bnb-1.png'],
        pool: 'USDC / ETH',
        tvl: '$256,000',
        prize: '$2,000,000',
        time: '15 mins ago'
      },
      {
        img: ['https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png', 'https://cryptomarketpool.com/wp-content/uploads/2021/07/bnb-1.png'],
        pool: 'USDC / ETH',
        tvl: '$256,000',
        prize: '$2,000,000',
        time: '15 mins ago'
      },
      {
        img: ['https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png', 'https://cryptomarketpool.com/wp-content/uploads/2021/07/bnb-1.png'],
        pool: 'USDC / ETH',
        tvl: '$256,000',
        prize: '$2,000,000',
        time: '15 mins ago'
      },
      {
        img: ['https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png', 'https://cryptomarketpool.com/wp-content/uploads/2021/07/bnb-1.png'],
        pool: 'USDC / ETH',
        tvl: '$256,000',
        prize: '$2,000,000',
        time: '15 mins ago'
      },
      {
        img: ['https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png', 'https://cryptomarketpool.com/wp-content/uploads/2021/07/bnb-1.png'],
        pool: 'USDC / ETH',
        tvl: '$256,000',
        prize: '$2,000,000',
        time: '15 mins ago'
      },
      {
        img: ['https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png', 'https://cryptomarketpool.com/wp-content/uploads/2021/07/bnb-1.png'],
        pool: 'USDC / ETH',
        tvl: '$256,000',
        prize: '$2,000,000',
        time: '15 mins ago'
      },
      {
        img: ['https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png', 'https://cryptomarketpool.com/wp-content/uploads/2021/07/bnb-1.png'],
        pool: 'USDC / ETH',
        tvl: '$256,000',
        prize: '$2,000,000',
        time: '15 mins ago'
      },

      {
        img: ['https://cryptomarketpool.com/wp-content/uploads/2021/07/eth-1.png', 'https://cryptomarketpool.com/wp-content/uploads/2021/07/bnb-1.png'],
        pool: 'USDC / ETH',
        tvl: '$256,000',
        prize: '$2,000,000',
        time: '15 mins ago'
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
          <>
            <img
              src={props.row.original.img[0]}
              width={20}
              alt='coin' 
            />
            <img
              src={props.row.original.img[1]}
              width={20}
              alt='coin'
              style={{margin: "0 0 0 -6px"}}
            /> 
            <span style={{margin: "0 0 0 6px"}}>{props.row.original.pool}</span>
          </> 
        )
      },
      {
        Header: 'TVL',
        accessor: 'tvl',
      },
      {
        Header: 'PRIZE POOL',
        accessor: 'prize',
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
      <h1>Reward Pools</h1>
      <div>
        <DataTable name={'Pools'} columns={columns} data={data} />  
      </div>
    </div>
  )
};

export default Transactions;
