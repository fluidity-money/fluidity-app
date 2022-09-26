import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from './screens/authenticated/dashboard';
import Rewards from './screens/authenticated/rewards';
import Assets from './screens/authenticated/assets';
import Dao from './screens/authenticated/dao';
import Home from './screens/Home';
import {ChainContext, Chains} from "./components/chains/ChainContext";
import './App.css'
import {useContext} from "react";
import ChainInterface from "./components/chains";

const Div = () => {
  const con = useContext(ChainContext)
  const {wallets, connected, chain, network, setNetwork, connect, disconnect, wrap, unwrap, send, setChain} = con || {};

  return <div style={{flexDirection: 'row', display: 'flex'}}>
    <div>
      {`connected: ${connected}. chain: ${chain}, network: ${network}`}
      <br/>
      <button onClick={disconnect}>disconnect</button>
      <br/>
      <button onClick={() => chain !== null && send("fUSDC", 10000, chain === "ethereum" ? "0x0000000000000000000000000000000000000000" : "8qgGrwdb7Lphf2fq8pdyRCjdEi9Z9qNHwK4Dtn7BL1Kj")}>send</button>
      <button onClick={() => chain !== null && wrap("USDC", 10000)}>wrap</button>
      <button onClick={() => chain !== null && unwrap("USDC", 10000)}>unwrap</button>
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
    <div>
      {chain !== null && 
        <ul>{Object.keys(wallets).map((k,i)=>
          <li style={{cursor: 'pointer'}} onClick={() => connect(network, k)} key={i}>
          {k}
          </li>)}
        </ul>
      }
    </div>
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
