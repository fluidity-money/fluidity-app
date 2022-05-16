import AppContainer from "components/Styling/AppContainer";
import AppBody from "components/Styling/AppBody";
import Icon from "../Icon";
import Button from "components/Button";
import { useHistory } from "react-router-dom";
import { chainIdFromEnv } from "util/chainId";

const Unsupported = () => {
  const history = useHistory();
  return (
    <div className="unsupported-container gradient-background">
      <div className="unsupported-content">
        <div className="f-logo-container">
          <Icon src="i-fluidity-large f-logo-icon" />
          <div className="fluidity-text f-logo-text">Fluidity.</div>
        </div>
        <div className="primary-text warning-text-heading">
          Sorry, this app is not supported on your browser
        </div>
        <div className="secondary-text warning-text">
          Please use Firefox, Brave, Chrome, or Edge
        </div>
        <Button
          label="Return to fluidity.money"
          theme={
            chainIdFromEnv() === 1313161554
              ? "primary-button-aurora"
              : "primary-button"
          }
          className="return-btn"
          goto={() => (window.location.href = "https://fluidity.money")}
        />
        <div className="social-container">
          <Icon
            src="i-twitter"
            trigger={() =>
              (window.location.href = "https://twitter.com/fluiditymoney")
            }
          />
          <Icon
            src="i-discord"
            trigger={() =>
              (window.location.href = "https://discord.gg/CNvpJk4HpC")
            }
          />
          <Icon
            src="i-telegram"
            trigger={() =>
              (window.location.href = "https://t.me/fluiditymoney")
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Unsupported;
