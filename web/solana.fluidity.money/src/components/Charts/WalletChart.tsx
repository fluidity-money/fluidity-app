// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import React from "react";
import Route from "util/api/types";
import Line from "react-chartjs-2";

const WalletChart = ({ data }: { data: Route['/prize-board'] }) => {
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
      gradient.addColorStop(0, "rgba(10, 202, 160, 0)");
      gradient.addColorStop(1, "rgba(10, 202, 160, 100)");
    }

    return gradient;
  }

  const months = [
    "January",
    "Feburary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const chartData = {
    labels: data.map((info) => {
      return `${
        new Date(info.awarded_time).getDate() +
        " " +
        months[new Date(info.awarded_time).getMonth()]
      }`;
    }),
    datasets: [
      {
        label: "Balance",
        data: data.map(info => Number(info.winning_amount)),
        borderColor: "#FFF",
        borderWidth: 1,
        tension: 0.05,
      },
    ],
  };

  return (
    // Chart setting config
    <>
      <Line
        type="line"
        data={chartData}
        options={{
          aspectRatio: 3,
          color: "#FFF",
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
              ticks: {
                color: "rgb(185, 190, 211)",
              },
            },
          },
          plugins: {
            legend: {
              display: false,
              position: "bottom",
            },
          },
          // pointRadius: 6,
          // pointBackgroundColor: "rgba(0,0,0,0)",
          // pointBorderColor: "rgba(0,0,0,0)",
          backgroundColor: function (context: any) {
            const chart = context.chart;
            const { ctx, chartArea } = chart;

            if (!chartArea) {
              // This case happens on initial chart load
              return null;
            }
            return getGradient(ctx, chartArea);
          } as () => CanvasGradient as any, // unfortunately required hack, so at least double cast for *some* safety
        }}
      />
    </>
  );
};

export default WalletChart;
