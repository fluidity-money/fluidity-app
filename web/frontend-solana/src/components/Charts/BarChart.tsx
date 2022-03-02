import {ChartOptions} from "chart.js";
import { useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import Routes from "util/api/types";

const sameDay = (first: Date, second: Date) =>
  first.getUTCDate() === second.getUTCDate() &&
  first.getUTCMonth() === second.getUTCMonth() &&
  first.getUTCFullYear() === second.getUTCFullYear();

const chartLabels = () => {
  const currentDate = new Date();

  const chartPastDays = 30
  // Get Date Mon from past 30 days, oldest first
  const dateLabels = Array.from({length: chartPastDays}, 
    (_, i) => {
      const offsetDate = new Date(currentDate.getDate() - i); 
      return `${offsetDate.getDate()} ${offsetDate.toLocaleString('default', {month: 'short'})}`;
    })
    .reverse()

  return dateLabels;
}

const pastWinnings = (data: Routes["/past-winnings"]) => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 29);
  // set smaller units to zero, as we only care about dd/mm/yy
  currentDate.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const winnings: number[] = [];

  // date labels are generated for current date - 29, so starting from that date
  // iterate each date displayed, pushing 0 for no win or an amount for an entry in `data`
  for (const d of data) {
    const winningDate = new Date(d.winning_date);
    // set smaller units to zero, as we only care about dd/mm/yy
    winningDate.setHours(0, 0, 0, 0);

    // ignore dates that are before the timeframe we want to display
    if (winningDate < currentDate)
      continue;

    // < tomorrow to stop infinitely looping on invalid data
    while (!sameDay(currentDate, winningDate) && currentDate < tomorrow) {
      winnings.push(0);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    if (sameDay(currentDate, winningDate)) {
      winnings.push(Number(d.winning_amount));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  return winnings;
}

const BarChart = ({ data }: { data: Routes["/past-winnings"] }) => {
  const label = chartLabels();
  const pastWinningsAmounts = useMemo(() => pastWinnings(data), [data]);

  // Gradient function that works in conjunction with Chart.js library
  // Code reference here: https://www.chartjs.org/docs/latest/samples/advanced/linear-gradient.html
  let width: any, height: any, gradient: any;
  function getGradient(ctx: any, chartArea: any) {
    const chartWidth = chartArea.right - chartArea.left;
    const chartHeight = chartArea.bottom - chartArea.top;
    if (gradient === null || width !== chartWidth || height !== chartHeight) {
      // Create the gradient because this is either the first render
      // or the size of the chart has changed
      width = chartWidth;
      height = chartHeight;
      gradient = ctx.createLinearGradient(
        0,
        chartArea.bottom,
        0,
        chartArea.top
      );

      gradient.addColorStop(0, "rgba(10, 202, 160, 0.05)");
      gradient.addColorStop(1, "#12ECAB");
    }

    return gradient;
  }

  // Chart data
  // Generate day labels (just generating 1-31 atm)
  const chartData = {
    labels: label,
    datasets: [
      {
        label: "Winnings",
        data: pastWinningsAmounts,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
          aspectRatio: 2.75,
          scales: {
            gridLines: {
              display: false,
            },
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 20000,
                color: "rgb(185, 190, 211)",
              },
            },
            x: {
              display: false,
            },
          },
          plugins: {
            legend: {
              display: false,
              position: "bottom",
            },
          },
          backgroundColor: function(context: any) {
            const chart = context.chart;
            const { ctx, chartArea } = chart;

            if (!chartArea) {
              // This case happens on initial chart load
              return null;
            }
            return getGradient(ctx, chartArea);
          } as () => CanvasGradient as any, // unfortunately required hack, so at least double cast for *some* safety
}
  return (
    // Chart setting config
    <>
      <Bar
        data={chartData}
        options={options}
      />
    </>
  );
};

export default BarChart;
