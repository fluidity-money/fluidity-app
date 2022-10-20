import { useState } from "react";
import { Link, useTransition } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { Text } from "@fluidity-money/surfing";

type Filter<T> = {
  filter: (item: T) => boolean;
  name: string;
};

export type ColumnProps = {
  name: string;
  alignRight?: boolean;
};

export type PaginationProps = {
  page: number;
  rowsPerPage: number;
  pageQuery?: string;
};

export type IRow<T> = React.FC<{ data: T; index: number }>;

type ITable<T> = {
  className?: string;
  itemName?: string;
  headings: ColumnProps[];

  pagination: PaginationProps;

  count: number;

  // Used for filters
  data: T[];

  // Render data into row
  renderRow: IRow<T>;

  // Filters based on elementData
  filters?: Filter<T>[];
};

const Table = <T,>(props: ITable<T>) => {
  const { itemName, pagination, data, renderRow, count, headings, filters } =
    props;

  const { rowsPerPage, page } = pagination;

  const pageCount = Math.ceil(count / rowsPerPage);

  const startIndex = (page - 1) * rowsPerPage + 1;
  const endIndex = Math.min(page * rowsPerPage, count);

  const isTransition = useTransition();

  const [activeFilterIndex, setActiveFilterIndex] = useState(0);

  return (
    <div>
      <div className="transactions-header row justify-between">
        {/* Item Count */}
        <Text>
          {count > 0 ? `${startIndex} - ${endIndex}` : 0} of {count} {itemName}
        </Text>

        {/* Filters*/}
        {filters && (
          <div>
            {filters.map((filter, i) => (
              <button
                key={`filter-${filter.name}`}
                onClick={() => setActiveFilterIndex(i)}
              >
                <Text prominent={activeFilterIndex === i}>{filter.name}</Text>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <table className="transaction-table">
        {/* Table Headings */}
        <thead>
          <tr>
            {headings.map((heading) => {
              const alignProps = heading.alignRight
                ? "alignRight"
                : "alignLeft";
              const classProps = `heading ${alignProps}`;

              return (
                <th className={classProps} key={heading.name}>
                  <Text>{heading.name}</Text>
                </th>
              );
            })}
          </tr>
        </thead>

        {/* Table Body */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.tbody
            key={`page-${page}`}
            initial="enter"
            animate={isTransition.state === "idle" ? "enter" : "transitioning"}
            exit="exit"
            variants={{
              enter: {
                opacity: 1,
                transition: {
                  when: "beforeChildren",
                  staggerChildren: 0.05,
                },
              },
              exit: {
                opacity: 0,
                transition: {
                  when: "afterChildren",
                  staggerChildren: 0.05,
                },
              },
              transitioning: {},
            }}
          >
            {data
              .filter((data) =>
                filters ? filters[activeFilterIndex].filter(data) : true
              )
              .map((row, i) => renderRow({ data: row, index: i }))}
          </motion.tbody>
        </AnimatePresence>
      </table>

      {/* Pagination */}
      <motion.div className="pagination" layout="position">
        <div className="pagination-numbers">
          {Array(pageCount)
            .fill(1)
            .map((_, i) => {
              return (
                <Link
                  className={
                    page === i + 1 ? "current-pagination" : "pagination-number"
                  }
                  key={i}
                  to={`?${pagination.pageQuery || "page"}=${i + 1}`}
                >
                  {i + 1}
                </Link>
              );
            })}
        </div>
        <div className="pagination-arrows">
          <Link
            to={
              page === 1 ? "" : `?${pagination.pageQuery || "page"}=${page - 1}`
            }
          >
            <img
              style={{ width: 16 }}
              src={
                page === 1
                  ? "/images/icons/arrowLeftDark.svg"
                  : "/images/icons/arrowLeftWhite.svg"
              }
              className={
                page === 1 ? "pagination-arrow-off" : "pagination-arrow"
              }
            />
          </Link>

          <Link
            to={
              page === pageCount
                ? ""
                : `?${pagination.pageQuery || "page"}=${page + 1}`
            }
          >
            <img
              style={{ width: 16 }}
              src={
                page === pageCount
                  ? "/images/icons/arrowRightDark.svg"
                  : "/images/icons/arrowRightWhite.svg"
              }
              className={
                page === pageCount ? "pagination-arrow-off" : "pagination-arrow"
              }
            />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Table;
