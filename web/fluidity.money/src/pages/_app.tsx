// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { AppProps } from 'next/app';

import Script from 'next/script';

import { useEffect, useState } from 'react';
import { ApolloProvider } from "@apollo/client";
import useViewport from "hooks/useViewport";
import { ChainContextProvider } from "hooks/ChainContext";
import apolloClient from "data/apolloClient";

import LoadingScreen from 'screens/Loading/LoadingScreen';
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
    <div id={"fluid"} />
    <div id="shade" />
    <div id="root">
      <ApolloProvider client={apolloClient}>
        <ChainContextProvider>
            <div className="App">
              {width < breakpoint ? (<MobileNavBar />) : (<NavBar />)}
              <Component {...pageProps} />
            </div>
        </ChainContextProvider>
      </ApolloProvider>
    </div>
    <Script src='assets/gfx/renderer.js' strategy='lazyOnload' />
  </>
}
