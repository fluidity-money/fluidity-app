import { Link, useTransition } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { GeneralButton, LoadingDots, Text } from "@fluidity-money/surfing";

type Filter<T> = {
  filter: (item: T) => boolean; // eslint-disable-line no-unused-vars
  name: string;
};

export type ColumnProps = {
  name: string;
  alignRight?: boolean;
};

export type PaginationProps = {
  paginate?: boolean;
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

  onFilter?: React.Dispatch<React.SetStateAction<number>>;

  activeFilterIndex?: number;

  loaded: boolean;

  showLoadingAnimation?: boolean;

  // Freeze a given row to the top of the table according to a boolean function
  freezeRow?: (data: T) => boolean;
};

const Table = <T,>(props: ITable<T>) => {
  const {
    count,
    itemName,
    pagination,
    data,
    renderRow,
    headings,
    filters,
    onFilter,
    activeFilterIndex,
    loaded,
    showLoadingAnimation = false,
    freezeRow,
  } = props;

  const { rowsPerPage, page, paginate } = pagination;

  const isTransition = useTransition();

  const cappedPageCount = Math.min(240, count);

  const pageCount = Math.ceil(cappedPageCount / rowsPerPage);

  const startIndex = (page - 1) * rowsPerPage + 1;
  const endIndex = Math.min(page * rowsPerPage, cappedPageCount);

  const frozenRows = data.filter((row) => freezeRow?.(row));

  return (
    <div>
      <div className="transactions-header">
        {/* Filters*/}
        {filters && (
          <div className={"transaction-filters"}>
            {filters.map((filter, i) => (
              <GeneralButton
                key={`filter-${filter.name}`}
                type={"secondary"}
                size={"medium"}
                handleClick={() => onFilter?.(i)}
                className={
                  activeFilterIndex === i
                    ? "active-filter-btn"
                    : "inactive-filter-btn"
                }
              >
                {filter.name}
              </GeneralButton>
            ))}
          </div>
        )}

        {/* Item Count */}
        {paginate !== false && (
          <Text>
            {cappedPageCount > 0 ? `${startIndex} - ${endIndex}` : 0} of{" "}
            {cappedPageCount} {itemName}
          </Text>
        )}
      </div>

      {/* Table */}
      {data.length === 0 ? (
        !loaded ? (
          <>
            Fetching table data...
            <div className="center-table-loading-anim loader-dots">
              {showLoadingAnimation && <LoadingDots />}
            </div>
          </>
        ) : (
          <>
            <div className="center-table-loading-anim loader-dots">
              <Text size="lg">No records found!</Text>
            </div>
          </>
        )
      ) : (
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
              animate={
                isTransition.state === "idle" ? "enter" : "transitioning"
              }
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
              {/* Frozen Rows */}
              {frozenRows.map((row, i) => renderRow({ data: row, index: i }))}
              {/* Unfrozen Rows */}
              {data
                .filter((_) => !freezeRow?.(_))
                .map((row, i) => renderRow({ data: row, index: i }))}
            </motion.tbody>
          </AnimatePresence>
        </table>
      )}
      {/* Pagination */}
      {pageCount > 0 && (
        <motion.div className="pagination" layout="position">
          <div className="pagination-numbers">
            {/* Pagination Numbers */}
            <Link
              className={
                page === 1 ? "current-pagination" : "pagination-number"
              }
              key={`page-${1}`}
              to={`?${pagination.pageQuery || "page"}=${1}`}
            >
              {1}
            </Link>

            {/* ... */}
            {pageCount > 4 && page > 4 && <span>...</span>}

            {Array(5)
              .fill(1)
              // Start pagination from page - 1
              .map((_, i) => i + page - 2)
              // Keep values between 2 and pageCount - 1
              .filter((pageNo) => pageNo > 1 && pageNo < pageCount)
              .map((pageNo) => {
                return (
                  <Link
                    className={
                      page === pageNo
                        ? "current-pagination"
                        : "pagination-number"
                    }
                    key={`page-${pageNo}`}
                    to={`?${pagination.pageQuery || "page"}=${pageNo}`}
                  >
                    {pageNo}
                  </Link>
                );
              })}

            {/* ... */}
            {pageCount > 4 && page < pageCount - 3 && <span>...</span>}

            {pageCount > 1 && (
              <Link
                className={
                  page === pageCount
                    ? "current-pagination"
                    : "pagination-number"
                }
                key={`page-${pageCount}`}
                to={`?${pagination.pageQuery || "page"}=${pageCount}`}
              >
                {pageCount}
              </Link>
            )}
          </div>

          {/* Pagination Arrows */}

          <div className="pagination-arrows">
            <Link
              to={
                page === 1
                  ? ""
                  : `?${pagination.pageQuery || "page"}=${page - 1}`
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
                  page === pageCount
                    ? "pagination-arrow-off"
                    : "pagination-arrow"
                }
              />
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Table;
