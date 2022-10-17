// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import Routes from "util/api/types";
import { trimAddress } from "util/addresses";
import { formatAmount } from "util/amounts";
import { etherscanAddress } from "util/etherscan";
import { appTheme } from "util/appTheme";

type infoGrid = {
  prizeBoard: Routes["/prize-board"];
};

//date formatter removed

const InfoGrid = ({ prizeBoard }: infoGrid) => {
  return (
    <div className="reward-info-table">
      <div className="reward-info-table-column">
        <div
          className={`reward-info-table-header secondary-text${appTheme} header`}
        >
          Amount
        </div>
        <div className="reward-info-table-column-container">
          {prizeBoard.map(({ winning_amount, token_details }, i) => (
            <div
              className={`reward-info-table-content${appTheme}`}
              key={winning_amount + String(i)}
            >
              $
              {formatAmount(winning_amount, token_details.token_decimals, token_details.token_decimals)
                .substring(0, 8)
                .split("")
                .map((e, idx) =>
                  !e.trim() ? (
                    <div key={idx}>{"\u00A0"}</div>
                  ) : (
                    <div key={idx}>{e}</div>
                  )
                )
              }
            </div>
          ))}
        </div>
      </div>
      <div className="reward-info-table-column">
        <div
          className={`reward-info-table-header secondary-text${appTheme} header`}
        >
          Winner
        </div>
        <div className="reward-info-table-column-container">
          {prizeBoard.map(({ winner_address }, index) => (
            <a
              className={`winner-address${appTheme}`}
              key={index}
              target="_blank"
              href={etherscanAddress(winner_address)}
              rel="noreferrer"
            >
              {trimAddress(winner_address)}
            </a>
          ))}
        </div>
      </div>
      <div className="reward-info-table-column">
        <div
          className={`reward-info-table-header header secondary-text${appTheme}`}
        >
          Date
        </div>
        <div className="reward-info-table-column-container">
          {prizeBoard.map(({ awarded_time }, i) => (
            <div
              className={`reward-info-table-content${appTheme}`}
              key={String(i) + awarded_time}
            >
              {new Date(awarded_time)
                .toLocaleString()
                .split("")
                .map((e, idx) =>
                  !e.trim() ? (
                    <div key={idx}>{"\u00A0"}</div>
                  ) : (
                    <div key={idx}>{e}</div>
                  )
                )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfoGrid;
