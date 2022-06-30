import {
  Area,
  AreaChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

const LineGraph = () => {
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<ValueType, NameType>) => {
    if (active) {
      return (
        <div
          style={{
            color: "white",
            fontFamily: "arial",
            textAlign: "left",
            width: 200,
            fontSize: 10,
          }}
        >
          <p>{label}</p>
          <p>
            {payload &&
              `${payload[1].name}: $${payload[1].payload["Maximum Expected Fluid Yield"]}`}
          </p>
          <p>
            {payload &&
              `${payload[0].name}: $${payload[0].payload["User Accumulated Fluid Yield"]}`}
          </p>
        </div>
      );
    } else return null;
  };

  const DataFormater = (number: number) => {
    return number.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };
  return (
    <div
      style={{
        backgroundColor: "#131823",
        borderRadius: 10,
        fontFamily: "Arial",
      }}
    >
      <ResponsiveContainer width={"100%"} height={250}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: -30, bottom: 0 }}
        >
          <Legend
            verticalAlign="top"
            align="center"
            height={36}
            // margin={{ left: 40, right: 0 }}

            iconType={"plainline"}
            formatter={(value, entry, index) => (
              <span
                style={{
                  color: "white",
                  fontSize: 9,
                }}
              >
                {value}
              </span>
            )}
          />
          <defs>
            <linearGradient id="colorUser" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#157F5F" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#157F5F" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C619C2" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#C619C2" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fontFamily: "arial", fontSize: 12 }}
            tickLine={true}
          />
          <YAxis
            tickFormatter={DataFormater}
            tickLine={true}
            tick={{ fontFamily: "arial", fontSize: 12 }}
          />

          <Tooltip content={CustomTooltip && <CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="User Accumulated Fluid Yield"
            stroke="#157F5F"
            fillOpacity={1}
            fill="url(#colorUser)"
          />
          <Area
            type="monotone"
            dataKey="Maximum Expected Fluid Yield"
            stroke="#C619C2"
            fillOpacity={1}
            fill="url(#colorMax)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// dummy data
const data = [
  {
    date: "01 Aug",
    "User Accumulated Fluid Yield": 10,
    "Maximum Expected Fluid Yield": 20,
  },
  {
    date: "02 Aug",
    "User Accumulated Fluid Yield": 12,
    "Maximum Expected Fluid Yield": 20,
  },
  {
    date: "03 Aug",
    "User Accumulated Fluid Yield": 9,
    "Maximum Expected Fluid Yield": 18,
  },
  {
    date: "04 Aug",
    "User Accumulated Fluid Yield": 10,
    "Maximum Expected Fluid Yield": 22,
  },
  {
    date: "05 Aug",
    "User Accumulated Fluid Yield": 7,
    "Maximum Expected Fluid Yield": 21,
  },
  {
    date: "06 Aug",
    "User Accumulated Fluid Yield": 8,
    "Maximum Expected Fluid Yield": 20,
  },
  {
    date: "07 Aug",
    "User Accumulated Fluid Yield": 9,
    "Maximum Expected Fluid Yield": 18,
  },
  {
    date: "08 Aug",
    "User Accumulated Fluid Yield": 7,
    "Maximum Expected Fluid Yield": 19,
  },
  {
    date: "09 Aug",
    "User Accumulated Fluid Yield": 6,
    "Maximum Expected Fluid Yield": 17,
  },
  {
    date: "10 Aug",
    "User Accumulated Fluid Yield": 6,
    "Maximum Expected Fluid Yield": 17,
  },
  {
    date: "11 Aug",
    "User Accumulated Fluid Yield": 8,
    "Maximum Expected Fluid Yield": 18,
  },
  {
    date: "12 Aug",
    "User Accumulated Fluid Yield": 5,
    "Maximum Expected Fluid Yield": 19,
  },
  {
    date: "13 Aug",
    "User Accumulated Fluid Yield": 4,
    "Maximum Expected Fluid Yield": 16,
  },
  {
    date: "14 Aug",
    "User Accumulated Fluid Yield": 5,
    "Maximum Expected Fluid Yield": 15,
  },
  {
    date: "15 Aug",
    "User Accumulated Fluid Yield": 4,
    "Maximum Expected Fluid Yield": 14,
  },
  {
    date: "16 Aug",
    "User Accumulated Fluid Yield": 6,
    "Maximum Expected Fluid Yield": 13,
  },
  {
    date: "17 Aug",
    "User Accumulated Fluid Yield": 8,
    "Maximum Expected Fluid Yield": 17,
  },
  {
    date: "18 Aug",
    "User Accumulated Fluid Yield": 7,
    "Maximum Expected Fluid Yield": 16,
  },
  {
    date: "19 Aug",
    "User Accumulated Fluid Yield": 6,
    "Maximum Expected Fluid Yield": 15,
  },
  {
    date: "20 Aug",
    "User Accumulated Fluid Yield": 5,
    "Maximum Expected Fluid Yield": 16,
  },
  {
    date: "21 Aug",
    "User Accumulated Fluid Yield": 4,
    "Maximum Expected Fluid Yield": 14,
  },
  {
    date: "22 Aug",
    "User Accumulated Fluid Yield": 5,
    "Maximum Expected Fluid Yield": 12,
  },
  {
    date: "23 Aug",
    "User Accumulated Fluid Yield": 3,
    "Maximum Expected Fluid Yield": 14,
  },
  {
    date: "24 Aug",
    "User Accumulated Fluid Yield": 3,
    "Maximum Expected Fluid Yield": 16,
  },
  {
    date: "25 Aug",
    "User Accumulated Fluid Yield": 5,
    "Maximum Expected Fluid Yield": 14,
  },
  {
    date: "26 Aug",
    "User Accumulated Fluid Yield": 3,
    "Maximum Expected Fluid Yield": 13,
  },
  {
    date: "27 Aug",
    "User Accumulated Fluid Yield": 2,
    "Maximum Expected Fluid Yield": 12,
  },
  {
    date: "28 Aug",
    "User Accumulated Fluid Yield": 1,
    "Maximum Expected Fluid Yield": 11,
  },
  {
    date: "29 Aug",
    "User Accumulated Fluid Yield": 2,
    "Maximum Expected Fluid Yield": 13,
  },
  {
    date: "30 Aug",
    "User Accumulated Fluid Yield": 4,
    "Maximum Expected Fluid Yield": 12,
  },
  {
    date: "31 Aug",
    "User Accumulated Fluid Yield": 3,
    "Maximum Expected Fluid Yield": 14,
  },
];
export default LineGraph;
