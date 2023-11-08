export interface AggregatedData {
  [from: string]: {
    rank?: number;
    user: string;
    volume: number;
    tx: number;
    earned: number;
  };
}

export interface Data {
  rank?: number;
  address: string;
  volume: string | number;
  number_of_transactions: number;
  yield_earned: string;
}

export type IRow = React.HTMLAttributes<HTMLDivElement> & {
  RowElement: React.FC<{ heading: string }>;
};
