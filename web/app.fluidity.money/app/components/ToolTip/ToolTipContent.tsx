import styles from "./styles.css";
import { Text, WarningIcon } from "@fluidity-money/surfing";

export const links = () => [{ rel: "stylesheet", href: styles }];

type IToolTipContentProps = {
  tokenLogoSrc?: string;
  boldTitle: string;
  details: string;
  linkLabel?: `ASSETS` | `DETAILS`;
  linkLabelOnClickCallback?: () => void;
};

export const ToolTipContent = ({
  tokenLogoSrc,
  boldTitle,
  details,
  linkLabel,
  linkLabelOnClickCallback,
}: IToolTipContentProps) => {
  return (
    <div className="tool_detail_section">
      <img className="tool_icon" src={tokenLogoSrc} />
      <span className="tooltip_title">
        <Text prominent size="xl">
          {boldTitle}{" "}
        </Text>
      </span>
      <span className="tooltip_content_details">
        <Text size="lg">
          <b>{details}</b>
        </Text>
      </span>
      <a onClick={linkLabelOnClickCallback} className="tool_content_link">
        <Text prominent size="lg">
          {linkLabel}
        </Text>
      </a>
    </div>
  );
};

export const NetworkTooltip = () =>
<div className="network_tooltip">
  <WarningIcon />
  <div>
    <Text prominent={true} bold={true} size="lg">Failed to switch network</Text>
    <br />
    <Text size="md">User declined network change</Text>
  </div>
</div>;
