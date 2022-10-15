import { Display, Text } from "@fluidity-money/surfing";
import { useToolTip } from "~/components";

export default function IndexPage() {
  const toolTip = useToolTip();
  const showToast = () =>
    toolTip.open(`Receive 10fusdc from 0x494..`);

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

      <button style={{ backgroundColor: 'blue', marginLeft:"10px", padding: "20px"}} onClick={showToast}>
        Pop Notification Demo
      </button>

    </div>
  );
}
