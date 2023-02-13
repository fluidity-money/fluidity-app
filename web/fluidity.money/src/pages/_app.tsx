// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { AppProps } from "next/app";

import Script from "next/script";

import { ApolloProvider } from "@apollo/client";
import { useViewport } from "@fluidity-money/surfing";
import { ChainContextProvider } from "hooks/ChainContext";
import { client } from "data/apolloClient";
import { useEffect, useState } from "react";

import NavBar from "components/NavBar";
import MobileNavBar from "components/MobileNavBar";
import "@fluidity-money/surfing/dist/style.css";
import "styles/app.global.scss";
import { CookieConsent } from "@fluidity-money/surfing";
import { useRouter } from "next/router";
import * as gtag from "utils/gtag";
import { GTM_ID } from "utils/gtag";

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
      gtag.pageview(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  const [cookieConsent, setCookieConsent] = useState(true);
  useEffect(() => {
    const _cookieConsent = localStorage.getItem("cookieConsent");
    if (!_cookieConsent) {
      setCookieConsent(false);
    }
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    if (width >= breakpoint) {
      script.src = "assets/gfx/renderer.js";
      document.body.appendChild(script);
    }

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [width, breakpoint]);

  return (
    <>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{
            display: "none",
            visibility: "hidden"
          }}
        ></iframe>
      </noscript>
      <div id={"fluid"} />
      <div id="shade" />
      <div id="root">
        <ApolloProvider client={client}>
          <ChainContextProvider>
            <div className="App">
              {width < breakpoint && width > 0 ? <MobileNavBar /> : <NavBar />}
              <Component {...pageProps} />
            </div>
          </ChainContextProvider>
        </ApolloProvider>
        <CookieConsent
          activated={cookieConsent}
          url={
            "https://static.fluidity.money/assets/fluidity-privacy-policy.pdf"
          }
          callback={() => {
            setCookieConsent(true);
          }}
        />
      </div>
    </>
  );
}
