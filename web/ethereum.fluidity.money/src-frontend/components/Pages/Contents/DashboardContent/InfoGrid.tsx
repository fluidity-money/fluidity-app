import Routes from "util/api/types";
import { trimAddress } from "util/addresses";
import dateFormatter from "util/dateFormatter";
import { formatAmount } from "util/amounts";
import { etherscanAddress } from "util/etherscan";

type infoGrid = {
  prizeBoard: Routes['/prize-board']
}

const InfoGrid = ({ prizeBoard }: infoGrid) =>
  <table className="prize-info-table">
    <thead>
      <tr>
        <th className="header secondary-text text-left font-1rem prize-board-column-header">Amount</th>
        <th className="header secondary-text text-left font-1rem prize-board-column-header">Winner</th>
        <th className="header secondary-text text-left font-1rem prize-board-column-header">Date</th>
      </tr>
    </thead>
    <tbody className="prize-info-table-body">
      {prizeBoard.map(({ winning_amount, winner_address, awarded_time }) =>
        <tr>
          <td className="secondary-text">${ formatAmount(winning_amount, 2) }</td>
          <td className="secondary-text">
            <a target="_blank" href={ etherscanAddress(winner_address)}>
              { trimAddress(winner_address) }
            </a>
          </td>
          <td className="secondary-text">{ dateFormatter(awarded_time) }</td>
        </tr>
      )}
    </tbody>
  </table>;

export default InfoGrid;
