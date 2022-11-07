import styles from "./styles.css";
import { Text } from "@fluidity-money/surfing";

export const links = () => [{ rel: "stylesheet", href: styles }];

type IToolTipContentProps = {
  tokenLogoSrc?: string;
  boldTitle: string;
  details: string;
  linkLabel: `ASSETS` | `DETAILS`;
  linkUrl: string;
};

export const ToolTipContent = ({
  tokenLogoSrc,
  boldTitle,
  details,
  linkLabel,
  linkUrl,
}: IToolTipContentProps) => {
  return (
    <>
      <img className="tool_icon" src={tokenLogoSrc} />
      <div>
        <Text prominent size="xl">
          {boldTitle}{" "}
        </Text>
        <Text size="lg">{details}</Text>
        <a href={linkUrl} className="tool_content_link">
          <Text prominent size="lg">
            {linkLabel}
          </Text>
        </a>
      </div>
    </>
  );
};
