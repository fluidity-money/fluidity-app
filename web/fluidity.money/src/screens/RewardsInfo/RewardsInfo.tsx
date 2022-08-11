import React from "react";
import styles from "./RewardsInfo.module.scss";
import styled from "styled-components"
import { useTable, usePagination } from 'react-table'


function Table({ columns, data }:any) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  }:any = useTable(
    {
      columns,
      data,
    },
    usePagination
  )

  // Render the UI for your table
  return (
    <>
      <div className={styles.filterContainer}>
        <h3>  1-12 of 120 transactions </h3>
        <ul>
          <li>All</li>
          <li>DEX</li>
          <li>NFT</li>
          <li>DeFi</li>
        </ul>
      </div>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup: { getHeaderGroupProps: () => JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>; headers: any[]; }) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row: { getRowProps: () => JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>; cells: any[]; }, i: any) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}

const RewardsInfo = () => {
  const data = React.useMemo(
    () => [
      {
        img: 'https://i.pinimg.com/originals/9e/f7/bc/9ef7bc75d2fea5cc38b0889d2bc499e8.jpg',
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
        <Table columns={columns} data={data} />  
      </div>
    </div>
  )
};

export default RewardsInfo;
