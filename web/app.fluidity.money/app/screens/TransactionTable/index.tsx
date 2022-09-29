import {
  Text,
} from "@fluidity-money/surfing";


import { isYesterday, isToday, formatDistanceToNow, format } from "date-fns";

import { motion } from "framer-motion";

import { Table } from "~/components";

type Transaction = {
  sender: string;
  receiver: string;
  timestamp: number;
  value: number;
  currency: string;
};

const address = "0xbb9cdbafba1137bdc28440f8f5fbed601a107bb6";

const ActivityLabel = (activity: Transaction, address: string) => {
  const { sender, currency } = activity;
  return sender === address ? `Sent ${currency}` : `Received ${currency}`;
};

const TransactionRow = (tx: Transaction, index: number) => {
  const { sender, receiver, timestamp, value, currency } = tx;
  
  const isTransactionToday = isToday(timestamp * 1000);
  const isTransactionYesterday = isYesterday(timestamp * 1000);

  let timeLabel = "";

  if (isTransactionToday) {
    timeLabel = formatDistanceToNow(timestamp * 1000, {
      addSuffix: true,
    });
  } else if (isTransactionYesterday) {
    timeLabel = `Yesterday ${format(
      timestamp * 1000,
      "h:mmaaa"
    )}`;
  } else {
    timeLabel = format(timestamp * 1000, "dd.MM.yy h:mmaaa");
  }

  return (
    <motion.tr
      key={`${timestamp}-${index}`}
      variants={{
        enter: { opacity: [0, 1] },
        ready: { opacity: 1 },
        exit: { opacity: 0 },
        transitioning: {
          opacity: [0.75, 1, 0.75],
          transition: { duration: 1.5, repeat: Infinity },
        },
      }}
    >
      {/* Activity */}
      <td>
        <a>
          <Text>
            {currency} {ActivityLabel(tx, address)}
          </Text>
        </a>
      </td>

      {/* Value */}
      <td>
        <Text>
        {value.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
        </Text>
      </td>

      {/* Reward */}
      <td>
        <Text prominent={true}>
          -
        </Text>
      </td>

      {/* Account */}
      <td>
        <a>
          <Text>
            {sender === address ? receiver : sender}
          </Text>
        </a>
      </td>

      {/* Time */}
      <td>{timeLabel}</td>
    </motion.tr>
  );
}

type ITransactionTable = {
  page: number;
  count: number;
  transactions: Transaction[];
}


const TransactionTable = ({page, count, transactions}: ITransactionTable) => {
    const txTableColumns = [
    {
      name: "ACTIVITY",
    },
    {
      name: "VALUE",
    },
    {
      name: "REWARD",
    },
    {
      name: "ACCOUNT",
    },
    {
      name: "TIME",
      alignRight: true,
    },
  ];

  return (
    <Table 
      itemName="transactions"
      headings={txTableColumns}
      pagination={{
        page: page,
        rowsPerPage: 12,
      }}
      count={count}
      data={transactions}
      renderRow={TransactionRow}
    />

  )
};

export default TransactionTable;
