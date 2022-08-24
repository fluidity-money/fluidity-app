import { useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ProtectedRoute } from 'surfing';

import Dashboard from './screens/authenticated/dashboard';
import Rewards from './screens/authenticated/rewards';
import Assets from './screens/authenticated/assets';
import Dao from './screens/authenticated/dao';
import Home from './screens/Home';
import './App.css'

const App = () => {
  const isConnected = () => true;

  return (
  <Router>
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
  </Router>
  )
}

export default App
