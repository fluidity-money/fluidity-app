// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { AppProps } from 'next/app';

import Script from 'next/script';

import { useEffect } from 'react';
import { ApolloProvider } from "@apollo/client";
import {useViewport} from '@fluidity-money/surfing';
import { ChainContextProvider } from "hooks/ChainContext";
import { client } from "data/apolloClient";

import NavBar from "components/NavBar";
import MobileNavBar from "components/MobileNavBar";
import "@fluidity-money/surfing/dist/style.css";
import "styles/app.global.scss"
import CookieConsent from 'components/CookieConsent/CookieConsent';
import { useRouter } from 'next/router';
import * as gtag from 'utils/gtag'

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

  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      gtag.pageview(url)
    }

    router.events.on("routeChangeComplete", handleRouteChange)

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [router.events])

  return <>
    <div id={"fluid"} />
    <div id="shade" />
    <div id="root">
      <ApolloProvider client={client}>
        <ChainContextProvider>
            <div className="App">
              {width < breakpoint && width > 0 ? (<MobileNavBar />) : (<NavBar />)}
              <Component {...pageProps} />
            </div>
        </ChainContextProvider>
      </ApolloProvider>
      <CookieConsent />
    </div>
    <Script src='assets/gfx/renderer.js' strategy='lazyOnload' />
  </>
}
