import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Dashboard from './screens/authenticated/dashboard';
import Rewards from './screens/authenticated/rewards';
import Assets from './screens/authenticated/assets';
import Dao from './screens/authenticated/dao';
import Home from './screens/Home';
import { Chain, chainContext, Network, Chains, NullableChain} from "./chainContext";
import './App.css'
import {ReactNode, useContext, useEffect, useState} from "react";
import {isInArray, ReactSetter} from "./utils/types";
import {useSolana, useWalletKit, WalletKitProvider} from "@gokiprotocol/walletkit";

const ChainInterface = ({children}: {children: React.ReactNode}) => {
  const [chain, setChain] = useState<NullableChain>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    setConnected(false);
  }, [chain]);

  switch (chain) {
  case "ethereum":
  default:
    return <>
      <EthereumInterface setChain={setChain} connected={connected} setConnected={setConnected}>
        {children}
      </EthereumInterface>
    </>
  case "solana":
    return <>
      <WalletKitProvider
        app={{name: "Fluidity"}}
      >
        <SolanaInterface setChain={setChain} connected={connected} setConnected={setConnected}>
          {children}
        </SolanaInterface>
      </WalletKitProvider>
    </>
  }
}

type InterfaceProps = {
  children?: ReactNode,
  setChain: ReactSetter<NullableChain>,
  connected: boolean,
  setConnected: ReactSetter<boolean>
}

const SolanaInterface = ({children, setChain, connected, setConnected}: InterfaceProps): JSX.Element => {
  const chain: Chain = "solana";
  const [network, setNetwork] = useState<Network<"solana">>("mainnet-beta");
  const wallet = useWalletKit();
  const solana = useSolana();
  const solanaConnected = solana.connected;

  useEffect(() => {
    setConnected(solanaConnected)
  }, [solanaConnected])

  useEffect(() => {
    setNetworkChecked(solana.network);
  }, [solana.network])

  // set network if it's valid for the chain
  const setNetworkChecked = (network: string) => {
    if (isInArray(network, Chains[chain]))
      solana.setNetwork(network);
  }

  const connect = (network: Network) => {
    if (!isInArray(network, Chains[chain]))
      return;

    wallet.connect()
    setNetwork(network);
  }

  const disconnect = async() => {
    solana.disconnect();
  }

  const wrap = () => {
    if (!connected)
      return;
    console.log("wrap solana!")
  }

  const unwrap = () => {
    if (!connected)
      return;
    console.log("unwrap solana!")
  }

  const value = {
    chain,
    setChain,
    connected,
    network: network as Network,
    setNetwork: setNetworkChecked,
    connect,
    disconnect,
    wrap,
    unwrap,
  }

  return <chainContext.Provider value={value}>
    {children}
  </chainContext.Provider>
}

const EthereumInterface = ({children, setChain, connected, setConnected}: InterfaceProps): JSX.Element => {
  const chain = "ethereum" as const;
  const [network, setNetwork] = useState<Network<"ethereum">>("mainnet");

  // set network if it's valid for the chain
  const setNetworkChecked = (network: string) => {
    if (isInArray(network, Chains[chain]))
      setNetwork(network)
  }

  const connect = (network: Network) => {
    if (!isInArray(network, Chains[chain]))
      return;

    setNetwork(network);
    setConnected(true);
  }

  const disconnect = () => {
    setConnected(false);
  }

  const wrap = () => {
    if (!connected)
      return;
    console.log("wrap ethereum!")
  }

  const unwrap = () => {
    if (!connected)
      return;
    console.log("unwrap ethereum!")
  }

  const value = {
    chain,
    setChain,
    connected,
    network: network as Network,
    setNetwork: setNetworkChecked,
    connect,
    disconnect,
    wrap,
    unwrap,
  }

  return <chainContext.Provider value={value}>
    {children}
  </chainContext.Provider>
}


const Div = () => {
  const con  = useContext(chainContext)
  const {connected, chain, network, setNetwork, connect, disconnect, wrap, unwrap, setChain} = con || {};

  // if (chain === "solana") setNetwork("devnet")

return <div>
      {`connected: ${connected}. chain: ${chain}, network: ${network}`}
      <br/>
      <button onClick={() => chain !== null && connect(network)}>connect</button>
      <button onClick={disconnect}>disconnect</button>
      <br/>
      <button onClick={wrap}>wrap</button>
      <button onClick={unwrap}>unwrap</button>
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
  // const isConnected = () => {
  //   const wallet = useWallet();
  //   return wallet.status === "connected";
  // }

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
