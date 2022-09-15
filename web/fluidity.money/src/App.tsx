// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.
//

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Pages
import { RelayEnvironmentProvider } from "react-relay";
import { ChainContextProvider } from "./hooks/ChainContext";
import NavBar from "./components/NavBar";
import LandingPage from "./pages/LandingPage";
import EcosystemPage from "./pages/EcosystemPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import ResourcesPage from "./pages/ResourcesPage";
import fluRelayEnvironment from "./data/relayEnvironment";
import useViewport from "hooks/useViewport";
import MobileNavBar from "components/MobileNavBar";
import "./styles/app.global.scss";
import "@fluidity-money/surfing/dist/style.css";

function App() {
  const { width } = useViewport();
  const breakpoint = 620;
  return (
    <RelayEnvironmentProvider environment={fluRelayEnvironment}>
      <ChainContextProvider>
        <Router>
          <div className="App">
            {width < breakpoint ? <MobileNavBar /> : <NavBar />}
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/howitworks" element={<HowItWorksPage />} />
              {/* Pages removed for now, not yet ready for production */}
              <Route path="/ecosystem" element={<EcosystemPage />} />
              {/* <Route path="/fluidstats" element={<FluidStatsPage /> */}

              <Route path="/resources" element={<ResourcesPage />} />
            </Routes>
          </div>
        </Router>
      </ChainContextProvider>
    </RelayEnvironmentProvider>
  );
}

export default App;

const logo = "./src/assets/images/logos/logoOutline.svg";
const text = "fluidity";
const button = {
  children: "LAUNCH FLUIDITY",
  version: "secondary",
  type: "text",
  size: "medium",
  handleClick: () => {},
};
const navLinks = [
  { name: "how it works", modal: false },
  // { name: "ecosystem", modal: false },
  // { name: "fluid stats", modal: false },
  { name: "resources", modal: true },
];
