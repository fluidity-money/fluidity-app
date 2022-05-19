import Icon from "components/Icon";
import ChainId, { chainIdFromEnv } from "util/chainId";

const AppContainer = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  return (
    <div
      className={
        chainIdFromEnv() === ChainId.AuroraMainnet
          ? "app-container gradient-background--aurora"
          : "app-container gradient-background"
      }
    >
      {children}
      {/* Fluidity text footer */}
      <div className="fluidity flex row flex-space-between width-auto">
        <Icon src="i-fluidity-medium" />
        <div className="fluidity-text">Fluidity.</div>
      </div>
    </div>
  );
};

export default AppContainer;
