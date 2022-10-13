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
        <span style={{ color: "rgba(255,255,255, 50%)" }}>{nearestDatum.key}</span>
      </span>
    </div>
  );
};



const { baseColor, generatedGradient, gradientIds } = {
  generatedGradient: (
    <>
      <linearGradient id="dim" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#000000" stopOpacity={0} />
        <stop offset="100%" stopColor="#000000" />
      </linearGradient>
      <radialGradient
        id="paint0_radial_704_33887"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(482.79 589.404) rotate(95.8174) scale(1436.84 254.075)"
      >
        <stop stop-color="#FFFDB1" />
        <stop offset="0.344597" stop-color="#FEE4BF" />
        <stop offset="0.695017" stop-color="#F0BDD0" />
        <stop offset="1" stop-color="#FF8126" stop-opacity="0" />
      </radialGradient>
      <linearGradient
        id="paint1_linear_704_33887"
        x1="302.242"
        y1="-99.152"
        x2="493.084"
        y2="-44.0742"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#C0A9F0" stop-opacity="0" />
        <stop offset="0.456382" stop-color="#C0A9F0" />
        <stop offset="1" stop-color="#C0A9F0" stop-opacity="0" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_704_33887"
        x1="569.905"
        y1="-344.278"
        x2="231.663"
        y2="-178.287"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#C0A9F0" stop-opacity="0" />
        <stop offset="0.461891" stop-color="#C0A9F0" />
        <stop offset="1" stop-color="#C0A9F0" stop-opacity="0" />
      </linearGradient>
      <linearGradient
        id="paint3_linear_704_33887"
        x1="135.327"
        y1="231.355"
        x2="390.196"
        y2="322.412"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#CDF9E8" />
        <stop offset="1" stop-color="#CDF9E8" stop-opacity="0" />
      </linearGradient>
      <radialGradient
        id="paint4_radial_704_33887"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(190.855 1468) rotate(-104.289) scale(544.271 368.5)"
      >
        <stop stop-color="#DC8DDC" />
        <stop offset="1" stop-color="#DC8DDC" stop-opacity="0" />
      </radialGradient>
      <radialGradient
        id="paint5_radial_704_33887"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(235.41 1276.58) rotate(-110.889) scale(411.244 519.951)"
      >
        <stop stop-color="#DC8DDC" />
        <stop offset="1" stop-color="#DC8DDC" stop-opacity="0" />
      </radialGradient>
      <radialGradient
        id="paint6_radial_704_33887"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(23.9999 1189) rotate(-15.8626) scale(190.245 416.77)"
      >
        <stop stop-color="#EBF3D0" />
        <stop offset="1" stop-color="#EBF3D0" stop-opacity="0" />
      </radialGradient>
    </>
  ),
  gradientIds: [
    "paint0_radial_704_33887",
    "paint1_linear_704_33887",
    "paint2_linear_704_33887",
    "paint3_linear_704_33887",
    "paint4_radial_704_33887",
    "paint5_radial_704_33887",
    "paint6_radial_704_33887",
  ],
  baseColor: "#C2A6F1",
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
