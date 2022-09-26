import { Display, Text } from "@fluidity-money/surfing";

export default function IndexPage() {
  return (
    <div>
      <Display>
        <Text>
          <Text prominent>{"{address}"}</Text>
          {" claimed "}
          <Text prominent>{"${amount}"}</Text>
          {" in fluid prizes over {transactionCount} transactions."}
        </Text>
      </Display>

      <Text size="xxl">Connect your wallet to see what you could make.</Text>
      <button>Make it rain</button>
    </div>
  );
}
