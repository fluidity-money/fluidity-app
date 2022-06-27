import { ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";

const SmallLineGraph = () => {
  // Dummy data until api endpoint for both lines
  const data = (canvas: HTMLCanvasElement | null) => {
    const ctx = canvas?.getContext("2d");
    const userGradient = ctx?.createLinearGradient(0, 0, 0, 310);
    userGradient?.addColorStop(0, "#132A2D");
    userGradient?.addColorStop(1, "#131823");
    const maxGradient = ctx?.createLinearGradient(0, 0, 0, 180);
    maxGradient?.addColorStop(0, "#30183D");
    maxGradient?.addColorStop(1, "#131823");
    return {
      // "04/29",
      //   "05/02",
      //   "05/05",
      //   "05/08",
      //   "05/11",
      //   "05/14",
      //   "05/17",
      //   "05/20",
      //   "05/23",
      //   "05/26",
      labels: [
        "04/29",
        "04/30",
        "05/01",
        "05/02",
        "05/03",
        "05/04",
        "05/05",
        "05/06",
        "05/07",
        "05/08",
        "05/09",
        "05/10",
        "05/11",
        "05/12",
        "05/13",
        "05/14",
        "05/15",
        "05/16",
        "05/17",
        "05/18",
        "05/19",
        "05/20",
        "05/21",
        "05/22",
        "05/23",
        "05/24",
        "05/25",
        "05/26",
        "05/27",
        "05/28",
        "05/29",
      ],
      datasets: [
        {
          label: "User Accumulated Fluid Yield",
          data: [
            14, 13, 10, 12, 8, 11, 5, 7, 10, 9, 7, 8, 11, 6, 4, 3, 4, 2, 1, 1,
            3, 1, 4, 3, 4, 2, 3, 1, 4, 2, 2,
          ],
          fill: true,

          borderColor: "#06DCE6",
          backgroundColor: userGradient,
          pointRadius: 0,
          borderWidth: 1,
          tension: 0.1,
          pointHoverRadius: 5,
        },
        {
          label: "Maximum Expected Fluid Yield",
          data: [
            24, 23, 20, 22, 18, 21, 15, 17, 20, 19, 17, 18, 21, 16, 14, 13, 14,
            12, 10, 10, 13, 10, 9, 7, 8, 5, 6, 3, 7, 5, 5,
          ],
          fill: true,
          borderColor: "#C388D7",
          backgroundColor: maxGradient,
          pointRadius: 0,
          borderWidth: 1,
          tension: 0.1,
          pointHoverRadius: 5,
        },
      ],
    };
  };

  const options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: {
        offset: true,
        ticks: {
          display: true,
          autoSkip: true,
          maxTicksLimit: 6,
          font: { size: 8 },
          maxRotation: 0,
          minRotation: 0,
        },
      },

      yAxes: {
        ticks: {
          mirror: true,
          z: 1,
          display: true,
          font: { size: 8 },
          padding: -2,

          callback: function (value, index, values) {
            return value.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            });
          },
          maxTicksLimit: 2,
          //stepSize should be max value from api endpoint
          stepSize: 30,
        },
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },

    plugins: {
      tooltip: {
        backgroundColor: "transparent",
        yAlign: "bottom",
        caretSize: 70,
        padding: { left: 30 },
      },

      legend: {
        labels: {
          boxWidth: 10,
          boxHeight: 5,
          color: "#828a90",
          font: { size: 8 },
          padding: 5,
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default SmallLineGraph;
