import Routes from "util/api/types";
import { solExplorer } from "util/solana/solExplorer";
import { trimAddress } from "util/addresses";
import { amountToDecimalString } from "util/numbers";
// import dateFormatter from "util/dateFormatter";
// import { formatAmount } from "util/amounts";
// import { etherscanAddress } from "util/etherscan";

type infoGrid = {
  prizeBoard: Routes["/prize-board"];
};

const InfoGrid = ({ prizeBoard }: infoGrid) => {
  return (
    <div className="reward-info-table">
      <div className="reward-info-table-column">
        <div className="reward-info-table-header header">Amount</div>
        <div className="reward-info-table-column-container">
          {prizeBoard.map(({ winning_amount, token_details }) => (
            <div className="reward-info-table-content" key={winning_amount}>
              $
              {winning_amount === "0"
                ? "0.000000"
                : amountToDecimalString(
                    winning_amount,
                    token_details.token_decimals
                  )
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
        <div className="reward-info-table-header header">Winner</div>
        <div className="reward-info-table-column-container">
          {prizeBoard.map(({ winner_address }, index) => (
            <a
              className="winner-address"
              key={index}
              target="_blank"
              href={solExplorer(winner_address, "address")}
              rel="noreferrer"
            >
              {trimAddress(winner_address)}
            </a>
          ))}
        </div>
      </div>
      <div className="reward-info-table-column">
        <div className="reward-info-table-header header">Date</div>
        <div className="reward-info-table-column-container">
          {prizeBoard.map(({ awarded_time }) => (
            <div className="reward-info-table-content" key={awarded_time}>
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
