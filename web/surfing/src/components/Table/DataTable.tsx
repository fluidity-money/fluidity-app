import React from 'react'
import { useTable, useFilters, useGlobalFilter, usePagination } from 'react-table';

import styles from './DataTable.module.scss';
import {ReactComponent as ArrowIcon } from "~/assets/images/buttonIcons/arrowRightWhite.svg";

const SelectColumnFilter = ({
  filterValue, setFilter, preFilteredRows, id, filterData
} :any) => {
 
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options :any = new Set()
    preFilteredRows.forEach(function (row :any) {
      
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  const filterList = filterData.map((filterBy: any) => {
    return (
      <li
      value={filterValue}
      onClick={() => {
      filterBy = filterBy == 'ALL' ? undefined : filterBy;
      setFilter(filterBy || undefined)
      }}
      >
        {filterBy}
      
      </li>
    );
  });

  return (
    <ul>{filterList}</ul>
  )
}

const DataTable = ({name, filterData = [], columns, data, displayedRowSize}: any) => {
  const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      prepareRow,
      page,
      canPreviousPage,
      canNextPage,
      pageOptions,
      pageCount,
      nextPage,
      previousPage,
      state: { pageIndex },
      preGlobalFilteredRows,
      setGlobalFilter,
    }:any = useTable(
      {
        columns,
        data,
      },
      useFilters,
      useGlobalFilter,
      usePagination,
    )
        
    return (
      <>
        <div className={styles.tableFilterContainer}>
          <h3>  {1}-{pageCount} of { data.length } {name} </h3>      
          <ul>
            <SelectColumnFilter
              filterValue={undefined}
              setFilter={setGlobalFilter}
              preFilteredRows={preGlobalFilteredRows}
              id={'type'}
              filterData={filterData}
            />
          </ul>
        </div>
        <div>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup: { getHeaderGroupProps: () => JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>; headers: any[]; }) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, index) => (
                  <th className={(displayedRowSize - 1) === index ? styles.alignRight : ''} {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row: { getRowProps: () => JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>; cells: any[]; }, i: any) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell, index) => {
                    return <td  className={(displayedRowSize - 1) === index ? styles.alignRight : ''} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className={styles.pagination}>
        <span>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
        </span>
        <span>
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          <ArrowIcon className={`${styles.icon}`}/>
          </button>
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            <ArrowIcon className={`${styles.icon}`}/>
          </button>
        </span>
      </div>
    </>
  )
};

export default DataTable;