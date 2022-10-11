// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import BarChart from "components/Charts/BarChart";
import { useState, useEffect } from "react";
import Routes from "util/api/types";
// import { formatCurrency } from "util/amounts";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

interface timelineData {
  begin: string;
  end: string;
}

type right = {
  pastWinnings: Routes["/past-winnings"];
};

const Right = ({ pastWinnings }: right) => {
  const [timeline, setTimeline] = useState<timelineData>({
    begin: "",
    end: "",
  });

  useEffect(() => {
    const currentDate = new Date();
    if (pastWinnings.length) {
      const sortedPastWinnings = pastWinnings.sort((a, b) => {
        return Number(a.winning_date) - Number(b.winning_date);
      });

      const pastDate = new Date(sortedPastWinnings[0].winning_date);
      setTimeline({
        begin: `${pastDate.getDate()} ${months[pastDate.getMonth()]}`,
        end: `${currentDate.getDate()} ${months[currentDate.getMonth()]}`,
      });
    }
  }, [pastWinnings]);

  const _totalWinningAmount = pastWinnings.reduce(
    (acc, { winning_amount }) => acc + Number(winning_amount),
    0
  );

  // const totalWinningAmount = formatCurrency(
  //   String(_totalWinningAmount)
  // );
  const totalWinningAmount = _totalWinningAmount;

  return (
    <div className="reward-box-body">
      <div className="pool-title-container">
        <p className="title__right__winning">Past winnings</p>
        <p className="title__right__number">
          ${Number(totalWinningAmount).toLocaleString()}
        </p>
      </div>

      <div className="bar-chart-container">
        <div className="bar-chart">
          <BarChart data={pastWinnings} />
        </div>

        <div className="timeline__div">
          <div className="timeline__bar"></div>

          <div className="timeline">
            <p className="timeline__text"> {timeline.begin} </p>
            <p className="timeline__text"> {timeline.end}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Right;
