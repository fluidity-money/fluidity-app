import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { Helmet } from "react-helmet";

import { Loading } from "@/screens";

import "./App.css";
import NetworkCore from "./common/NetworkCore";
import DashLayout from "./common/DashLayout";

const Home = lazy(() => import("@/screens/Home"));
const Dashboard = lazy(() => import("@/screens/Dashboard"));
const Rewards = lazy(() => import("@/screens/Rewards"));
const Assets = lazy(() => import("@/screens/Assets"));
const DAO = lazy(() => import("@/screens/DAO"));
const Fluidify = lazy(() => import("@/screens/Fluidify"));
const FluidifyIn = lazy(() => import("@/screens/FluidIn"));
const FluidifyOut = lazy(() => import("@/screens/FluidOut"));

const App = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Router>
          <Routes>
            <Route index element={<Home />} />
            <Route path=":network" element={<NetworkCore />}>
              <Route index element={<Navigate replace to={"dashboard"} />} />
              <Route path="dashboard" element={<DashLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="home" element={<Dashboard />} />
                <Route path="rewards" element={<Rewards />} />
                <Route path="assets" element={<Assets />} />
                <Route path="dao" element={<DAO />} />
              </Route>
              <Route path="fluidify">
                <Route index element={<Fluidify />} />
                <Route path=":assetId">
                  <Route index element={<FluidifyIn />} />
                  <Route path="unwrap" element={<FluidifyOut />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </Router>
      </Suspense>

      <Helmet>
        <title>Fluidity</title>
        <meta
          name="description"
          content="Fluidity is a platform for getting more utility out of your crypto assets."
        />
      </Helmet>
    </>
  );
};

export default App;
