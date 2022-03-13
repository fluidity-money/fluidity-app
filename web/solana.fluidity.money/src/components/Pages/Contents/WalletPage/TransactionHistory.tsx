import Routes from "util/api/types";
import dateFormatter from "util/dateFormatter";
import {solExplorer} from "util/solana/solExplorer";
import { trimAddress } from "util/addresses";
import {amountToDecimalString} from "util/numbers";

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
  // sort new -> old (greatest -> least)
  const history = myHistory
    .sort((a, b) => new Date(b.time).valueOf() - new Date(a.time).valueOf())
    .map(history => {
    const {
      transaction_hash,
      type,
      swap_in,
      amount,
      recipient_address,
      token_details: {
        token_short_name,
        token_decimals
      },
      time
    } = history;

    let direction = "";

    const tokenName = token_short_name.startsWith('f') ?
      token_short_name.slice(1) :
      token_short_name;
      const fluidTokenName = 'f' + tokenName;

    if (swap_in) direction = `${tokenName}-${fluidTokenName}`;
    else if (type === "send" || type === "received") direction = `${fluidTokenName}`;
    else direction = `${fluidTokenName}-${tokenName}`;

    const amountString = amountToDecimalString(amount, token_decimals);

    const recipientAddress =
      recipient_address ? recipient_address : "";

    return [
      dateFormatter(time),
      type,
      direction,
      amountString,
      // "$"+formatAmount(amountString),
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
                { row[4] ? <a target="_blank" href={ solExplorer(row[4], 'address') }>
                  { trimAddress(row[4]) }
                </a> : null }
              </td>

              <td className="fixed-content">
                { row[5] ? <a target="_blank" href={ solExplorer(row[5], 'tx') }>
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

