import { AppProps } from 'next/app';

import Script from 'next/script';

import { useEffect } from 'react';



import { RelayEnvironmentProvider } from "react-relay";
import useViewport from "hooks/useViewport";
import { ChainContextProvider } from "hooks/ChainContext";
import fluRelayEnvironment from "data/relayEnvironment";
import NavBar from "components/NavBar";
import MobileNavBar from "components/MobileNavBar";
import "@fluidity-money/surfing/dist/style.css";
import "styles/app.global.scss"



export default function MyApp({ Component, pageProps }: AppProps) {
    const { width } = useViewport();
    const breakpoint = 620;

    const location = typeof window !== "undefined" ? window.location : null;
    useEffect(() => {
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
    <div id={"fluid"}></div>
    <div id="shade">

    </div>

    <div id="root">
    
    <RelayEnvironmentProvider environment={fluRelayEnvironment}>
    <ChainContextProvider>
        <div className="App">
          {width < breakpoint ? <MobileNavBar /> : <NavBar />}
          <Component {...pageProps} />
        </div>
    </ChainContextProvider>
  </RelayEnvironmentProvider>
    </div>
    <Script src='assets/gfx/renderer.js' strategy='lazyOnload' />
    </>

}
