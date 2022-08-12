import React from "react";
import styles from "./LineChart.module.scss";

import { useLivePrizePool } from "data/LivePrivePool";

import {
  AreaClosed
} from "@visx/shape"

import {
  withParentSizeModern
} from "@visx/responsive"


const ChartItself = () => {
  const d = new Date().getTime() - new Date(2020, 0, 1).getTime()
  return <AreaClosed
    data={[]}
  />
}

const LineChart = () => {
  return <div className={styles.container}>
    withParentSizeModern()
  </div>;
};

export default LineChart;
