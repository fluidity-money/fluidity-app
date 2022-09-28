import { AppProps } from 'next/app';

import Script from 'next/script';

import { useEffect, useState } from 'react';



import { RelayEnvironmentProvider } from "react-relay";
import useViewport from "hooks/useViewport";
import { ChainContextProvider } from "hooks/ChainContext";
import fluRelayEnvironment from "data/relayEnvironment";
import NavBar from "components/NavBar";
import MobileNavBar from "components/MobileNavBar";
import "@fluidity-money/surfing/dist/style.css";
import "styles/app.global.scss"
import LoadingScreen from 'screens/Loading/LoadingScreen';



export default function MyApp({ Component, pageProps }: AppProps) {
  const { width } = useViewport();
  const breakpoint = 620;

  const location = typeof window !== "undefined" ? window.location : null;
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {

    if(!loaded) {
      setTimeout(() => {
        setLoaded(true);
      }, 3000)
    }

    if (location.hash) {
      let elem = document.getElementById(location.hash.slice(1));
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [location]);

  return <>
    <div id={"fluid"} />
    <div id="shade" />
    <div id="root">
      <RelayEnvironmentProvider environment={fluRelayEnvironment}>
        <ChainContextProvider>
            <div className="App">
              {loaded ?
                <>{width < breakpoint ? (<MobileNavBar />) : (<NavBar />)}
                  <Component {...pageProps} />
                </> 
                : <LoadingScreen />
              }
            </div>
        </ChainContextProvider>
      </RelayEnvironmentProvider>
    </div>
    <Script src='assets/gfx/renderer.js' strategy='lazyOnload' />
  </>
}
