import Routes from "util/api/types";
import {solExplorer} from "util/solana/solExplorer";
import { trimAddress } from "util/addresses";
import {amountToDecimalString} from "util/numbers";
// import dateFormatter from "util/dateFormatter";
// import { formatAmount } from "util/amounts";
// import { etherscanAddress } from "util/etherscan";

type infoGrid = {
  prizeBoard: Routes['/prize-board']
}

const InfoGrid = ({ prizeBoard }: infoGrid) =>
  <table className="reward-info-table">
    <thead>
      <tr>
        <th className="header secondary-text text-left font-1rem reward-board-column-header">Amount</th>
        <th className="header secondary-text text-left font-1rem reward-board-column-header">Winner</th>
        <th className="header secondary-text text-left font-1rem reward-board-column-header">Date</th>
      </tr>
    </thead>
    <tbody className="reward-info-table-body">
      {prizeBoard.map(({ winning_amount, winner_address, awarded_time, token_details: {token_decimals} }, i) =>
        <tr key={awarded_time + i}>
          <td className="fixed-content secondary-text">${amountToDecimalString(winning_amount, token_decimals)}</td>
          <td className="fixed-content secondary-text">
            <a target="_blank" href={solExplorer(winner_address, 'address')}>
              {trimAddress(winner_address)}
            </a>
          </td>
          <td className="fixed-content secondary-text">{new Date(awarded_time).toLocaleString()}</td>
        </tr>
      )}
    </tbody>
  </table>;

export default InfoGrid;

