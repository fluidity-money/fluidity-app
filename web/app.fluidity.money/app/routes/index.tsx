import { Display, Text } from "@fluidity-money/surfing";
import { useToolTip } from "~/components";

export default function IndexPage() {
  const toolTip = useToolTip();
  const showNotification = () =>
    toolTip.open(
      `#0000ff`,
      <>
        <img
          className="tool_icon"
          src="https://s2.coinmarketcap.com/static/img/coins/64x64/1.png"
        />
        <div>
          <Text prominent size="xl">
            100 fUSDC{" "}
          </Text>
          <Text size="lg">Received from 0x0000</Text>
          <a className="tool_content_link">
            <Text prominent size="lg">
              ASSETS
            </Text>
          </a>
        </div>
      </>
    );

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

      <button
        style={{ backgroundColor: "blue", marginLeft: "10px", padding: "20px" }}
        onClick={showNotification}
      >
        Pop Notification Demo
      </button>
    </div>
  );
}
