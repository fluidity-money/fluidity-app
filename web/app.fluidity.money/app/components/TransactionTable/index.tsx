import type { Chain } from "~/util/chainUtils/chains";
import type { IRow } from "~/components/Table";

import { Text, trimAddress } from "@fluidity-money/surfing";

import { getAddressExplorerLink } from "~/util";

import { isYesterday, isToday, formatDistanceToNow, format } from "date-fns";

import { motion } from "framer-motion";

import { Table } from "~/components";
import { Link } from "@remix-run/react";
import useViewport from "~/hooks/useViewport";

type Transaction = {
  sender: string;
  receiver: string;
  timestamp: number;
  value: number;
  currency: string;
};

const activityLabel = (activity: Transaction, address: string) => {
  const { sender, currency } = activity;
  return sender === address ? `Sent ${currency}` : `Received ${currency}`;
};

const timeLabel = (timestamp: number) => {
  const isTransactionToday = isToday(timestamp * 1000);
  const isTransactionYesterday = isYesterday(timestamp * 1000);

  if (isTransactionToday)
    return formatDistanceToNow(timestamp * 1000, {
      addSuffix: true,
    });

  if (isTransactionYesterday)
    return `Yesterday ${format(timestamp * 1000, "h:mmaaa")}`;

  return format(timestamp * 1000, "dd.MM.yy h:mmaaa");
};

type ITransactionTable = {
  page: number;
  count: number;
  transactions: Transaction[];
  chain: Chain;
  address: string;
};

const TransactionTable = ({
  page,
  count,
  transactions,
  chain,
  address,
}: ITransactionTable) => {
  const { width } = useViewport();
  const breakpoint = 850;

  const txTableColumns =
    width > 0 && width < breakpoint
      ? [{ name: "ACTIVITY" }, { name: "REWARD" }]
      : [
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

  const filters = [
    {
      filter: () => true,
      name: "ALL",
    },
    {
      filter: ({ sender, receiver }: Transaction) =>
        address in [sender, receiver],
      name: "YOUR REWARDS",
    },
  ];

  const TransactionRow = (chain: Chain, address: string): IRow<Transaction> =>
    function Row({ data, index }: { data: Transaction; index: number }) {
      const { sender, receiver, timestamp, value, currency } = data;

      const txAddress = sender === address ? receiver : sender;

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
            <a className="table-activity">
              <img
                src={
                  currency === "USDC"
                    ? "/images/tokenIcons/usdcFluid.svg"
                    : "/images/tokenIcons/usdtFluid.svg"
                }
              />
              <Text>{activityLabel(data, address)}</Text>
            </a>
          </td>

          {/* Value */}
          {width > breakpoint && (
            <td>
              <Text>
                {value.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </Text>
            </td>
          )}

          {/* Reward */}
          <td>
            <Text prominent={true}>-</Text>
          </td>

          {/* Account */}
          {width > breakpoint && (
            <td>
              <Link
                className="table-address"
                to={getAddressExplorerLink(chain, txAddress)}
              >
                <Text>{trimAddress(txAddress)}</Text>
              </Link>
            </td>
          )}

          {/* Time */}
          {width > breakpoint && (
            <td>
              <Text>{timeLabel(timestamp)}</Text>
            </td>
          )}
        </motion.tr>
      );
    };

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
      renderRow={TransactionRow(chain, address)}
      filters={filters}
    />
  );
};

export default TransactionTable;
