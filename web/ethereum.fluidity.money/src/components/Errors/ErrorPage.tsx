import type { FC } from "react";

import Header from "components/Header";
import AppBody from "components/Styling/AppBody";
import AppContainer from "components/Styling/AppContainer";
import Toolbar from "components/Toolbar";
import { FluidityToolBarTheme as ToolbarContents } from "components/Toolbar/ToolbarContents/FluidityToolBarTheme";

const ErrorPage: FC<{}> = () => {
  return (
    <AppContainer>
      <Toolbar>
        <ToolbarContents selected={{ options: [false, false, false] }} />
      </Toolbar>
      <AppBody direction="align p-1" alignment="space-between">
        <div className="rnf-container">
          <Header children="Oh no..." type="primary" className="rnf-header" />
          <Header
            children="Something has gone wrong."
            type="primary"
            className="rnf-text"
          />
          <Header
            children="We have been notified and are working on fixing it!"
            type="primary"
            className="rnf-text"
          />
        </div>
      </AppBody>
    </AppContainer>
  );
};

export default ErrorPage;
