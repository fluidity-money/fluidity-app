import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ProtectedRoute, Web3Provider, useWallet } from 'surfing';

import Dashboard from './screens/authenticated/dashboard';
import Rewards from './screens/authenticated/rewards';
import Assets from './screens/authenticated/assets';
import Dao from './screens/authenticated/dao';
import Home from './screens/Home';
import './App.css'

const App = () => {
  const isConnected = () => {
    const wallet = useWallet();
    return wallet.status === "connected";
  }

  return (
  <Router>
    <Web3Provider>
    <Routes>
      <Route
        path="/"
        element={<Home />}
      />
        
      <ProtectedRoute
        predicate={isConnected}
        path="/dashboard"
        component={Dashboard}
        extraProps={{}}
      />
      <ProtectedRoute
        predicate={isConnected}
        path="/rewards"
        component={Rewards}
        extraProps={{}}
      />
      <ProtectedRoute
        predicate={isConnected}
        path="/assets"
        component={Assets}
        extraProps={{}}
      />
      <ProtectedRoute
        predicate={isConnected}
        path="/dao"
        component={Dao}
        extraProps={{}}
      />
    </Routes>
    </Web3Provider>
  </Router>
  )
}

export default App
