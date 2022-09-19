import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from './screens/authenticated/dashboard';
import Rewards from './screens/authenticated/rewards';
import Assets from './screens/authenticated/assets';
import Dao from './screens/authenticated/dao';
import Home from './screens/Home';
import {chainContext, Chains} from "./components/chains/chainContext";
import './App.css'
import {useContext} from "react";
import ChainInterface from "./components/chains";

const Div = () => {
  const con = useContext(chainContext)
  const {connected, chain, network, setNetwork, connect, disconnect, wrap, unwrap, setChain} = con || {};

  return <div>
    {`connected: ${connected}. chain: ${chain}, network: ${network}`}
    <br/>
    <button onClick={() => chain !== null && connect(network)}>connect</button>
    <button onClick={disconnect}>disconnect</button>
    <br/>
    <button onClick={() => wrap("USDC", 10000)}>wrap</button>
    <button onClick={() => unwrap("USDC", 10000)}>unwrap</button>
    <br/>
    <button onClick={() => setChain("solana")}>solana</button>
    <button onClick={() => setChain("ethereum")}>ethereum</button>
    {chain !== null && 
      <ul>{Chains[chain].map((k,i)=>
        <li style={{cursor: 'pointer'}} onClick={() => setNetwork(k)} key={i}>
        {k}
        </li>)}
      </ul>
    }
  </div>
}

const App = () => {
  return <>
    <ChainInterface>
    <Div/>
    </ChainInterface>
  </>
  return (
  <Router>
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
  </Router>
  )
}

export default App
