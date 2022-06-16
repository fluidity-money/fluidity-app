import { ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";

const LineGraph = () => {
  const data = (canvas: HTMLCanvasElement | null) => {
    const ctx = canvas?.getContext("2d");
    const userGradient = ctx?.createLinearGradient(0, 0, 0, 310);
    userGradient?.addColorStop(0, "#132A2D");
    userGradient?.addColorStop(1, "#131823");
    const maxGradient = ctx?.createLinearGradient(0, 0, 0, 180);
    maxGradient?.addColorStop(0, "#30183D");
    maxGradient?.addColorStop(1, "#131823");
    return {
      labels: [
        "04/29",
        "05/02",
        "05/05",
        "05/08",
        "05/11",
        "05/14",
        "05/17",
        "05/20",
        "05/23",
        "05/26",
      ],
      datasets: [
        {
          label: "User Accumulated Fluid Yield",
          data: [
            14, 13, 10, 12, 8, 11, 5, 7, 10, 9, 7, 8, 11, 6, 4, 3, 4, 2, 1, 1,
            3, 1, 4, 3, 4, 2, 3, 1, 4, 2,
          ],
          fill: true,

          borderColor: "#157F5F",
          backgroundColor: userGradient,
          pointRadius: 0,
          borderWidth: 1,
          tension: 0.1,
        },
        {
          label: "Maximum Expected Fluid Yield",
          data: [
            24, 23, 20, 22, 18, 21, 15, 17, 20, 19, 17, 18, 21, 16, 14, 13, 14,
            12, 10, 10, 13, 10, 9, 7, 8, 5, 6, 3, 7, 5,
          ],
          fill: true,
          borderColor: "#C619C2",
          backgroundColor: maxGradient,
          pointRadius: 0,
          borderWidth: 1,
          tension: 0.1,
        },
      ],
    };
  };

  const options: ChartOptions = {
    responsive: true,
    scales: { xAxes: { offset: true } },

    interaction: {
      mode: "index",
      intersect: false,
    },

    plugins: {
      legend: {
        labels: {
          boxWidth: 10,
          boxHeight: 5,
          color: "#828a90",
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineGraph;
