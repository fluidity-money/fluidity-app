import React, { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { LoadingDots, Text } from "@fluidity-money/surfing";

import { IRow } from "../../types";

import styles from "../../page.module.scss";

type ColumnProps = {
  name: string;
  show?: boolean;
  alignRight?: boolean;
};

type ITable<T> = {
  className?: string;
  headings: ColumnProps[];

  data: T[];

  // Render data into row
  renderRow: (data: T) => IRow;

  loaded?: boolean;

  showLoadingAnimation?: boolean;

  // Freeze a given row to the top of the table according to a boolean function
  freezeRow?: (data: T) => boolean;
};

const Table = <T,>(props: ITable<T>) => {
  const { data, renderRow, headings, loaded, showLoadingAnimation, freezeRow } =
    props;

  const frozenRows = useMemo(() => {
    return data.filter((row) => freezeRow?.(row));
  }, [data, freezeRow]);

  const filteredHeadings = headings.filter(
    ({ show }) => show === undefined || show
  );

  const Row = ({ RowElement, index, className }: IRow & { index: number }) => {
    return (
      <motion.tr
        className={className}
        key={`row-${index}`}
        variants={{
          enter: { opacity: [0, 1] },
          ready: { opacity: 1 },
          exit: { opacity: 1 },
          transitioning: {
            opacity: [0.75, 1, 0.75],
            transition: { duration: 1.5, repeat: Infinity },
          },
        }}
      >
        {filteredHeadings.map(({ name }) => (
          <RowElement heading={name} key={name} />
        ))}
      </motion.tr>
    );
  };

  return (
    <div>
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
        <table className={styles.table_content}>
          {/* Table Headings */}
          <thead>
            <tr>
              {filteredHeadings.map((heading) => {
                return (
                  <th key={heading.name}>
                    <Text className={styles.heading}>{heading.name}</Text>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Table Body */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.tbody
              variants={{
                enter: {
                  opacity: 1,
                  transition: {
                    when: "beforeChildren",
                    staggerChildren: 0.05,
                  },
                },
                exit: {
                  opacity: 1,
                  transition: {
                    when: "afterChildren",
                    staggerChildren: 0.05,
                  },
                },
                transitioning: {},
              }}
            >
              {/*<tbody>*/}
              {/* Frozen Rows */}
              {frozenRows.map((row, i) => (
                <Row index={i} key={i} {...renderRow(row)} />
              ))}
              {/* Unfrozen Rows */}
              {data
                .filter((row) => !freezeRow?.(row))
                .map((row, i) => (
                  <Row index={i} key={i} {...renderRow(row)} />
                ))}
            </motion.tbody>
          </AnimatePresence>
        </table>
      )}
    </div>
  );
};

export default Table;
