import Routes from "util/api/types";
import { trimAddress } from "util/addresses";
import { formatAmount } from "util/amounts";
import dateFormatter from "util/dateFormatter";
import { etherscanAddress, etherscanTransaction } from "util/etherscan";

const tableItems = [
  'Date',
  'Type',
  'Currency',
  'Amount',
  'Recipient',
  'Transaction ID'
];

type transactionHistory = {
  myHistory: Routes['/my-history']
};

const TransactionHistory = ({myHistory}: transactionHistory) => {
  const history = myHistory.map(history => {
    const {
      transaction_hash,
      type,
      swap_in,
      amount,
      recipient_address,
      time
    } = history;

    let direction = "";

    if (swap_in) direction = "USDT-fUSDT";
    else if (type === "send" || type === "received") direction = "fUSDT"
    else direction = "fUSDT - USDT";

    const amountString = String(amount);

    const recipientAddress =
      recipient_address ? recipient_address : "";

    return [
      dateFormatter(time),
      type,
      direction,
      "$"+formatAmount(amountString),
      recipientAddress,
      transaction_hash
    ];
  });

  return (
    <div className="transaction-history">
      <table className="history-table">
        <tbody>
          <tr>
            {tableItems.map((tableItems, index) => (
              <th key={index} className="primary-text">{tableItems}</th>
            ))}
          </tr>
          {history.map((row, index) => (
            <tr key={index}>
              <td className="fixed-content">{ row[0] }</td>

              {row.slice(1, 4).map((value, index) => (
                <td key={index}>{value}</td>
              ))}

              <td className="fixed-content">
                { row[4] ? <a target="_blank" href={ etherscanAddress(row[4]) }>
                  { trimAddress(row[4]) }
                </a> : null }
              </td>

              <td className="fixed-content">
                { row[5] ? <a target="_blank" href={ etherscanTransaction(row[5]) }>
                  { trimAddress(row[5]) }
                </a> : null }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;
