// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { ParentSizeModern } from "@visx/responsive";

import { AnimatedAreaSeries, XYChart, Tooltip } from "@visx/xychart";

import styles from "./LineChart.module.scss";

type Props = {
  data: any[];
  xLabel: string;
  yLabel: string;
  lineLabel: string;
  accessors: {
    xAccessor: (d: any) => any;
    yAccessor: (d: any) => any;
  };
};

//
const ChartTooltip = ({ colorScale, nearestDatum, accessors }: any) => {
  return (
    <div className={styles.tooltip}>
      <span>
        {accessors.yAccessor(nearestDatum.datum)}{" "}
        <span style={{ color: "rgba(255,255,255, 50%)" }}>
          {nearestDatum.key}
        </span>
      </span>
    </div>
  );
};

const { baseColor, generatedGradient, gradientIds } = {
  generatedGradient: (
    <>
      <linearGradient id="dim" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#000000" stopOpacity={0.3} />
        <stop offset="70%" stopColor="#000000" />
      </linearGradient>

      <linearGradient
        id="paint0_linear_704_33887"
        x1="-300"
        y1="0"
        x2="600"
        y2="-200"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#C0A9F0" stop-opacity="0" />
        <stop offset="0.456382" stop-color="#C0A9F0" />
        <stop offset="1" stop-color="#C0A9F0" stop-opacity="0" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_704_33887"
        x1="400"
        y1="-300"
        x2="2000"
        y2="-100"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#9FD4F3" stop-opacity="0" />
        <stop offset="0.461891" stop-color="#FFD2C4" />
        <stop offset="1" stop-color="#FFD2C4" stop-opacity="0" />
      </linearGradient>
    </>
  ),
  gradientIds: ["paint0_linear_704_33887", "paint1_linear_704_33887"],
  baseColor: "transparent",
};

const _LineChart = ({
  accessors,
  data,
  lineLabel,
  xLabel,
  yLabel,
  ...props
}: Props & any) => {
  return (
    <XYChart
      xScale={{
        type: "linear",
        domain: [
          Math.min(...data.map(accessors.xAccessor)),
          Math.max(...data.map(accessors.xAccessor)),
        ],
        zero: false,
      }}
      yScale={{ type: "linear" }}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      {...props}
    >
      <defs>{generatedGradient}</defs>
      <AnimatedAreaSeries
        id={`gradient-base`}
        fill={baseColor}
        stroke={"#FFFFFF"}
        dataKey={lineLabel}
        lineProps={{ stroke: "#fff" }}
        data={data}
        {...accessors}
      />
      {gradientIds.map((id) => (
        <AnimatedAreaSeries
          id={`gradient-${id}`}
          fill={`url(#${id})`}
          lineProps={{ stroke: "#fff" }}
          dataKey={lineLabel}
          data={data}
          {...accessors}
        />
      ))}

      <rect x="0" y="0" width="100%" height="100%" fill="url(#dim)" />

      <Tooltip
        showVerticalCrosshair
        style={{
          position: "absolute",
        }}
        renderTooltip={({ tooltipData, colorScale }: any) => (
          <ChartTooltip
            nearestDatum={tooltipData.nearestDatum}
            colorScale={colorScale}
            accessors={accessors}
          />
        )}
      />
    </XYChart>
  );
};

const LineChart = (props: Props) => {
  const defaultAccessors = {
    xAccessor: (d: any) => d.x,
    yAccessor: (d: any) => d.y,
  };

  const defaultProps: Props = {
    accessors: defaultAccessors,
    data: [],
    xLabel: "Unlabeled",
    yLabel: "Unlabeled",
    lineLabel: "Unlabeled",
  };

  const calculatedProps = {
    ...defaultProps,
    ...props,
  };

  return (
    <ParentSizeModern>
      {(parent) => (
        <_LineChart
          {...calculatedProps}
          parentSize={parent}
          parentWidth={parent.width}
          parentHeight={parent.height}
          parentTop={parent.top}
          parentLeft={parent.left}
          parentRef={parent.ref}
          resizeParent={parent.resize}
        />
      )}
    </ParentSizeModern>
  );
};

export default LineChart;
