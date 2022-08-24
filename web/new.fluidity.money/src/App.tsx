import { useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Dashboard from './screens/authenticated/dashboard';
import Rewards from './screens/authenticated/rewards';
import Assets from './screens/authenticated/assets';
import Dao from './screens/authenticated/dao';
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

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
        exact={true}
        path="/dashboard"
        component={Dashboard}
        extraProps={{}}
      />
      <ProtectedRoute
        exact={true}
        path="/rewards"
        component={Reward}
        extraProps={{}}
      />
      <ProtectedRoute
        exact={true}
        path="/assets"
        component={Assets}
        extraProps={{}}
      />
      <ProtectedRoute
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
