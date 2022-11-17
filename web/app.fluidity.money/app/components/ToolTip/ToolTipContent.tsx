import styles from "./styles.css";
import { Text } from "@fluidity-money/surfing";

export const links = () => [{ rel: "stylesheet", href: styles }];

type IToolTipContentProps = {
  tokenLogoSrc?: string;
  boldTitle: string;
  details: string;
  linkLabel: `ASSETS` | `DETAILS`;
  linkLabelOnClickCallback: () => void;
};

export const ToolTipContent = ({
  tokenLogoSrc,
  boldTitle,
  details,
  linkLabel,
  linkLabelOnClickCallback,
}: IToolTipContentProps) => {
  return (
    <>
      <img className="tool_icon" src={tokenLogoSrc} />
      <div>
        <Text prominent size="xl">
          {boldTitle}{" "}
        </Text>
        <Text size="lg">{details}</Text>
        <a onClick={linkLabelOnClickCallback} className="tool_content_link">
          <Text prominent size="lg">
            {linkLabel}
          </Text>
        </a>
      </div>
    </>
  );
};
