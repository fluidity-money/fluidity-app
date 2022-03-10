import { Doughnut } from "react-chartjs-2";

const DoughnutGraph = ({
  data,
  labels,
  colours
}: {
  data: string[];
  labels: string[];
  colours: string[];
}) => {
  // For "Other" colour (if valid)
  // MVP tokens

  // Pushes the 'other' colour onto the list of colours when more than 4 coins are found
  if (labels.length > 3) {
    colours.push("hsla(0, 100%, 55%, 1)");
  };

  const graphData = {
    labels: labels,
    datasets: [
      {
        data: data.map(Number),
        backgroundColor: colours,
        borderColor: () => {
          for (let i = 0; i < labels.length; i++) {
            return "rgba(255, 255, 255, 1)";
          }
          return "rgba(255, 255, 255, 1)";
        },
        textColor: "#FFF",
        borderWidth: 1,
        hoverOffset: 15,
        padding: 50,
      },
    ],
  };

  const options = {
    layout: {
      padding: 12,
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return <Doughnut data={graphData} options={options} />;
};

export default DoughnutGraph;
