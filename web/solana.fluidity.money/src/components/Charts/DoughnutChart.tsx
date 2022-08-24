// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { Doughnut } from "react-chartjs-2";

const DoughnutGraph = ({
  data,
  labels,
  colours,
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
  }

  const graphData = {
    labels: labels,
    datasets: [
      {
        data: data.map((d) => Number(d)),
        backgroundColor: colours,
        borderColor: colours,
        textColor: "#FFF",
        borderWidth: 1,
        hoverOffset: 15,
        padding: 50,
      },
    ],
  };

  const options = {
    cutout: "92%",
    borderRadius: 10,
    spacing: 16,
    layout: {
      padding: 12,
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <Doughnut
      data={graphData}
      options={options}
      style={{ position: "relative", zIndex: 3, cursor: "pointer" }}
    />
  );
};

export default DoughnutGraph;
