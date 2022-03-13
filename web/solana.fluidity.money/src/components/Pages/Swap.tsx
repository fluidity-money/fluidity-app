import Toolbar from "components/Toolbar";
import { FluidityToolBarTheme as ToolbarContents } from "components/Toolbar/ToolbarContents/FluidityToolBarTheme";
import AppContainer from "components/Styling/AppContainer";
import AppBody from "components/Styling/AppBody";
import SwapText from "components/Pages/Contents/SwapPage/SwapText";
import SwapBox from "components/Pages/Contents/SwapPage/SwapBox";

const Swap = () => {

  return (
    <AppContainer>
      <Toolbar>
        <ToolbarContents
          selected={{ options: [false, true, false] }}
        />
      </Toolbar>
      <AppBody direction="align p-1" alignment="space-between">
        <SwapText />
        <SwapBox />
      </AppBody>
    </AppContainer>
  );
};

export default Swap;
