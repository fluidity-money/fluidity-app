import "./styles/app.global.scss";
import "surfing/dist/style.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Pages
//import { NavBar } from "surfing";
import NavBar from "./components/NavBar";
import LandingPage from "./pages/LandingPage";
import EcosystemPage from "./pages/EcosystemPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import FluidStatsPage from "./pages/FluidStatsPage";
import ResourcesPage from "./pages/ResourcesPage";

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/howitworks" element={<HowItWorksPage />} />
          <Route path="/ecosystem" element={<EcosystemPage />} />
          <Route path="/fluidstats" element={<FluidStatsPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
