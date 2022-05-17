import Routes from "util/api/types";
import { trimAddress } from "util/addresses";
import { formatAmount } from "util/amounts";
import { etherscanAddress } from "util/etherscan";
import { chainIdFromEnv } from "util/chainId";

type infoGrid = {
  prizeBoard: Routes["/prize-board"];
};

//date formatter removed

const InfoGrid = ({ prizeBoard }: infoGrid) => {
  const aurora = chainIdFromEnv() === 1313161554 ? "--aurora" : "";

  return (
    <div className="reward-info-table">
      <div className="reward-info-table-column">
        <div
          className={`reward-info-table-header secondary-text${aurora} header`}
        >
          Amount
        </div>
        <div className="reward-info-table-column-container">
          {prizeBoard.map(({ winning_amount, token_details }, i) => (
            <div
              className={`reward-info-table-content${aurora}`}
              key={winning_amount + String(i)}
            >
              $
              {formatAmount(winning_amount, token_details.token_decimals)
                .substring(0, 8)
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
      <div className="reward-info-table-column">
        <div
          className={`reward-info-table-header secondary-text${aurora} header`}
        >
          Winner
        </div>
        <div className="reward-info-table-column-container">
          {prizeBoard.map(({ winner_address }, index) => (
            <a
              className={`winner-address${aurora}`}
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
          className={`reward-info-table-header header secondary-text${aurora}`}
        >
          Date
        </div>
        <div className="reward-info-table-column-container">
          {prizeBoard.map(({ awarded_time }, i) => (
            <div
              className={`reward-info-table-content${aurora}`}
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
