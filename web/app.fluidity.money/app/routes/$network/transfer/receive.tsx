import {
  Checkmark,
  CopyIcon,
  GeneralButton,
  Heading,
  Text,
  Hoverable,
  InfoCircle,
  useViewport,
} from "@fluidity-money/surfing";
import { LinksFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { useContext, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import dashboardStyles from "~/styles/dashboard.css";
import transferStyles from "~/styles/transfer.css";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: dashboardStyles },
    { rel: "stylesheet", href: transferStyles },
  ];
};

const Receive = () => {
  const { network } = useParams();
  const { address } = useContext(FluidityFacadeContext);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [copied]);

  const mobileWidthBreakpoint = 768;
  const { width } = useViewport();
  const isMobile = width < mobileWidthBreakpoint;

  return (
    <div className={`transfer-container receive ${isMobile ? "mobile" : ""}`}>
      <Heading className="receive-heading">Receive Fluid Assets</Heading>
      <div className="receive-badge">
        <div className="receive-qr">
          <div className="receive-qr-outline" />
          <QRCode
            className="receive-qr-code"
            value={`https://app.fluidity.money/${network}/transfer/send&address=${
              address as string
            }`}
            style={{ width: "50%" }}
            size={180}
            fgColor="#000000"
            bgColor="#ffffff"
          />
        </div>
      </div>
      <div className="receive-details">
        {isMobile && <div className="receive-card-outline" />}
        <Text bold className="receive-your-address">
          YOUR ADDRESS
        </Text>
        <Text prominent size="xl" className="receive-address">
          {address}
        </Text>
        <GeneralButton
          type="secondary"
          onClick={() => {
            navigator.clipboard.writeText(address as string);
            setCopied(true);
          }}
          icon={copied ? <Checkmark /> : <CopyIcon />}
          className={`receive-copy-button ${copied ? "copied" : ""}`}
        >
          {copied ? "Copied!" : "Copy Address"}
        </GeneralButton>
      </div>
      <Hoverable
        className="receive-hint"
        tooltipContent="You can receive any token on the selected network, but only Fluid Assets like fUSDC will earn you rewards. Double-check your webapp network prior to receiving tokens!"
        style={{ marginTop: 10, minWidth: 300 }}
      >
        <InfoCircle />
        <Text>Which assets can I receive?</Text>
      </Hoverable>
    </div>
  );
};

export default Receive;
