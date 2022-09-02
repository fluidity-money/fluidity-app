// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import React from "react";
import "./styles/app.global.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// Pages
import NavBar from "./components/NavBar";
import LandingPage from "./pages/LandingPage";
import EcosystemPage from "./pages/EcosystemPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import FluidStatsPage from "./pages/FluidStatsPage";
import ResourcesPage from "./pages/ResourcesPage";
import useViewport from "hooks/useViewport";
import MobileNavBar from "components/MobileNavBar";

function App() {
  const { width } = useViewport();
  const breakpoint = 620;
  return (
    <Router>
      <div className="App">
        {width < breakpoint ? <MobileNavBar /> : <NavBar />}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/howitworks" element={<HowItWorksPage />} />
          {/* Pages removed for now, not yet ready for production */}
          {/* <Route path="/ecosystem" element={<EcosystemPage />} />
          <Route path="/fluidstats" element={<FluidStatsPage />} /> */}
          <Route path="/resources" element={<ResourcesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
