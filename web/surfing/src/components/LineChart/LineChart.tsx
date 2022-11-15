// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import type { RenderTooltipParams } from "@visx/xychart/lib/components/Tooltip";

import { ParentSizeModern } from "@visx/responsive";

import { AnimatedAreaSeries, XYChart, Tooltip } from "@visx/xychart";

import styles from "./LineChart.module.scss";

type Props<Datum extends object> = {
  data: Datum[];
  xLabel: string;
  yLabel: string;
  lineLabel: string;
  accessors: {
    xAccessor: (d: Datum) => number | Date;
    yAccessor: (d: Datum) => number;
  };
  renderTooltip: ({datum}: {datum: Datum} & Element) => React.ReactNode
} & any;

//
const ChartTooltip = ({ datum }: { datum: any }) => {
  return (
    <span>
      {datum.y}{" "}
      <span style={{ color: "rgba(255,255,255, 50%)" }}>
        {datum.key}
      </span>
    </span>
  );
};

const { baseColor, generatedGradient, gradientIds } = {
  generatedGradient: (
    <>
      <linearGradient id="dim" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#000000" stopOpacity={0} />
        <stop offset="90%" stopColor="#000000" />
      </linearGradient>

      <linearGradient
        id="paint0_linear_704_33887"
        x1="-300"
        y1="0"
        x2="600"
        y2="-200"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#C0A9F0" stopOpacity="0" />
        <stop offset="0.456382" stopColor="#C0A9F0" />
        <stop offset="1" stopColor="#C0A9F0" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_704_33887"
        x1="400"
        y1="-300"
        x2="2000"
        y2="-100"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#9FD4F3" stopOpacity="0" />
        <stop offset="0.461891" stopColor="#FFD2C4" />
        <stop offset="1" stopColor="#FFD2C4" stopOpacity="0" />
      </linearGradient>
    </>
  ),
  gradientIds: ["paint0_linear_704_33887", "paint1_linear_704_33887"],
  baseColor: "transparent",
};

const _LineChart = <Datum extends object,>({
  accessors,
  data,
  lineLabel,
  xLabel,
  yLabel,
  renderTooltip,
  ...props
}: Props<Datum>) => {
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
      yScale={{ type: "linear", zero: false }}
      margin={{ top: 10, right: 0, bottom: 0, left: 0 }}
      height={props.parentHeight * 9 / 10}
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
          key={`gradient-${id}`}
          fill={`url(#${id})`}
          lineProps={{ stroke: "#fff" }}
          dataKey={lineLabel}
          data={data}
          {...accessors}
        />
      ))}

      <rect x="0" y="0" width="100%" height={`${props.parentHeight}`} fill="url(#dim)" />

      <Tooltip
        showVerticalCrosshair
        style={{
          position: "absolute",
        }}
        renderTooltip={({ tooltipData }: RenderTooltipParams<Datum>) => (
          tooltipData?.nearestDatum &&
            <>
              {renderTooltip({datum: tooltipData.nearestDatum.datum})}
            </>
        )}
      />
    </XYChart>
  );
};

const LineChart = <Data extends object,>(props: Props<Data>) => {
  const defaultAccessors = {
    xAccessor: (d: any) => d.x,
    yAccessor: (d: any) => d.y,
  };

  const defaultProps: Props<Data> = {
    accessors: defaultAccessors,
    data: [],
    xLabel: "Unlabeled",
    yLabel: "Unlabeled",
    lineLabel: "Unlabeled",
    renderTooltip: ChartTooltip,
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
