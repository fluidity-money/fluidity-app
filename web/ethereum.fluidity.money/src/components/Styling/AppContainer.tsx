import Icon from "components/Icon";
import { appTheme } from "util/appTheme";

const AppContainer = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  return (
    <div className={`app-container gradient-background${appTheme}`}>
      {children}
      {/* Fluidity text footer */}
      <div className="fluidity-footer flex row flex-space-between width-auto">
        <Icon src="i-fluidity-medium" />
        <div className="fluidity-text">Fluidity.</div>
      </div>
    </div>
  );
};

export default AppContainer;
