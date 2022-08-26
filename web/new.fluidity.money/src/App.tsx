import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
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
    <Switch>
      <Route
        path="/"
        exact
        render={(props) => (
          <Home />
        )}
      />
        
      <ProtectedRoute
        predicate={isConnected}
        exact={true}
        path="/dashboard"
        component={Dashboard}
        extraProps={{}}
      />
      <ProtectedRoute
        predicate={isConnected}
        exact={true}
        path="/rewards"
        component={Rewards}
        extraProps={{}}
      />
      <ProtectedRoute
        predicate={isConnected}
        exact={true}
        path="/assets"
        component={Assets}
        extraProps={{}}
      />
      <ProtectedRoute
        predicate={isConnected}
        exact={true}
        path="/dao"
        component={Dao}
        extraProps={{}}
      />
    </Switch>
    </Web3Provider>
  </Router>
  )
}

export default App
