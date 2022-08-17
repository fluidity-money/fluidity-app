import { ParentSizeModern } from "@visx/responsive";

import {
  AnimatedAxis,
  AnimatedAreaSeries,
  XYChart,
  Tooltip,
} from "@visx/xychart";

import {
  RadialGradient
} from "@visx/gradient";

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

const ChartTooltip = ({ colorScale, nearestDatum, accessors }: any) => {
  return (
    <div>
      <div style={{ color: colorScale(nearestDatum.key) }}>
        {nearestDatum.key}
      </div>
      {accessors.xAccessor(nearestDatum.datum)}
      {", "}
      {accessors.yAccessor(nearestDatum.datum)}
    </div>
  );
};

const _LineChart = ({ accessors, data, lineLabel, xLabel, yLabel, ...props }: Props & any) => {
  return (
    <>
      <XYChart xScale={{ type: "linear", domain: [Math.min(...data.map(accessors.xAccessor)), Math.max(...data.map(accessors.xAccessor))], zero: false}} yScale={{ type: "linear" }} {...props}>
        <AnimatedAreaSeries dataKey={lineLabel} data={data} {...accessors} />
        <Tooltip
          snapTooltipToDatumX
          snapTooltipToDatumY
          showSeriesGlyphs
          renderTooltip={({ tooltipData, colorScale }: any) => (
            <ChartTooltip
              nearestDatum={tooltipData.nearestDatum}
              colorScale={colorScale}
              accessors={accessors}
            />
          )}
        />
      </XYChart>
    </>
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
