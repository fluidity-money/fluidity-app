/// <reference types="react" />
declare type Props = {
    data: any[];
    xLabel: string;
    yLabel: string;
    lineLabel: string;
    accessors: {
        xAccessor: (d: any) => any;
        yAccessor: (d: any) => any;
    };
};
declare const LineChart: (props: Props) => JSX.Element;
export default LineChart;
