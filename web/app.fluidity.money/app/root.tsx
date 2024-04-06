import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import {
  useLoaderData,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import { init as initSentry } from "@sentry/remix";
import { Integrations } from "@sentry/tracing";
import { withSentry } from "@sentry/remix";

import globalStylesheetUrl from "./global-styles.css";
import surfingStylesheetUrl from "@fluidity-money/surfing/dist/style.css";
import { JoeFarmlandsOrCamelotKingdomLinks, ToolTipLinks, FLYClaimSubmitModalLinks } from "./components";
import { ToolProvider } from "./components/ToolTip";
import CacheProvider from "contexts/CacheProvider";
import { useEffect, useState } from "react";
import { CookieConsent } from "@fluidity-money/surfing";
import { Buffer } from "buffer";

globalThis.Buffer = Buffer;

// Removed LinkFunction as insufficiently typed (missing apple-touch-icon)
export const links = () => {
  return [
    ...ToolTipLinks(),
    ...JoeFarmlandsOrCamelotKingdomLinks(),
    ...FLYClaimSubmitModalLinks(),
    { rel: "icon", href: "/favicon.ico" },

    { rel: "apple-touch-icon", sizes: "57x57", href: "/apple-icon-57x57.png" },
    { rel: "apple-touch-icon", sizes: "60x60", href: "/apple-icon-60x60.png" },
    { rel: "apple-touch-icon", sizes: "72x72", href: "/apple-icon-72x72.png" },
    { rel: "apple-touch-icon", sizes: "76x76", href: "/apple-icon-76x76.png" },

    {
      rel: "apple-touch-icon",
      sizes: "114x114",
      href: "/apple-icon-114x114.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "120x120",
      href: "/apple-icon-120x120.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "144x144",
      href: "/apple-icon-144x144.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "152x152",
      href: "/apple-icon-152x152.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-icon-180x180.png",
    },

    {
      rel: "icon",
      type: "image/png",
      sizes: "192x192",
      href: "/android-icon-192x192.png",
    },

    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "96x96",
      href: "/favicon-96x96.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16x16.png",
    },

    { rel: "manifest", href: "/manifest.json" },

    { rel: "msapplication-TileColor", content: "#000000" },
    { rel: "msapplication-TileImage", href: "/ms-icon-144x144.png" },

    { rel: "theme-color", content: "#000000" },

    { rel: "stylesheet", href: globalStylesheetUrl },
    { rel: "stylesheet", href: surfingStylesheetUrl },
  ];
};

export const meta: MetaFunction<LoaderData> = ({
  data: { gitSha, isProduction, isStaging, host },
}) => ({
  charset: "utf-8",
  title: "Fluidity",
  description:
    "Fluidity is a platform for getting more utility out of your crypto assets.",
  viewport: "width=device-width,initial-scale=1",
  "og:image": "https://static.fluidity.money/img/FluidShare.png",
  "og:site_name": "Fluidity Money",

  "fluidity:version": gitSha,
  "fluidity:environment": isProduction
    ? "production"
    : isStaging
    ? "staging"
    : "development",
  "fluidity:host": host,
});

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const nodeEnv = process.env.NODE_ENV;
  const sentryDsn = process.env?.FLU_SENTRY_DSN ?? "";

  const host = request.headers.get("Host") ?? "unknown-host";

  const isProduction =
    nodeEnv === "production" && host === "app.fluidity.money";
  const isStaging =
    nodeEnv === "production" && host === "staging.app.fluidity.money";

  const gitSha = process.env?.GIT_SHA?.slice(0, 8) ?? "unknown-git-sha";

  const GTAG_ID = process.env["FLU_GTAG_ID"];
  const GTM_ID = process.env["FLU_GTM_ID"];

  return {
    nodeEnv,
    sentryDsn,
    GTAG_ID,
    GTM_ID,
    isProduction,
    isStaging,
    host,
    gitSha,
  };
};

function ErrorBoundary(err: Error) {
  console.error(err);
  return (
    <html>
      <head>
        <Meta />
        <Links />
      </head>
      <body
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img src="https://app-cdn.fluidity.money/images/logoMetallic.png" alt="" style={{ height: "40px" }} />
        <h1>Something went wrong!</h1>
        <br />
        <h2>Our team has been notified, and are working on fixing it!</h2>
        <Scripts />
      </body>
    </html>
  );
}

type LoaderData = {
  nodeEnv: string;
  sentryDsn: string;
  GTAG_ID?: string;
  GTM_ID?: string;
  isProduction: boolean;
  isStaging: boolean;
  gitSha?: string;
  host?: string;
};

function App() {
  const {
    nodeEnv,
    sentryDsn,
    GTAG_ID,
    GTM_ID,
    isProduction,
    gitSha = "unknown",
  } = useLoaderData<LoaderData>();

  switch (true) {
    case nodeEnv !== "production":
      console.log("Running in development, ignoring Sentry initialisation...");
      break;
    case !sentryDsn:
      console.error("DSN not set!");
      break;
    default:
      initSentry({
        dsn: sentryDsn,
        integrations: [new Integrations.BrowserTracing()],
        tracesSampleRate: 1.0,
      });
  }

  const location = useLocation();

  useEffect(() => {
    if (GTAG_ID && typeof window.gtag !== "undefined") {
      window.gtag("config", GTAG_ID, {
        page_path: new URL(window.location.href),
      });
    }
  }, [location, GTAG_ID]);

  const [activatedCookieConsent, setActivatedCookieConsent] = useState(true);
  useEffect(() => {
    const _cookieConsent = localStorage.getItem("cookieConsent");

    if (!_cookieConsent) {
      setActivatedCookieConsent(false);
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        {GTAG_ID && GTM_ID && isProduction && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','${GTM_ID}');`,
              }}
            />
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '${GTAG_ID}');
                    `,
              }}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                      (function (h, o, t, j, a, r) {
                        h.hj =
                          h.hj ||
                          function () {
                            (h.hj.q = h.hj.q || []).push(arguments);
                          };
                        h._hjSettings = { hjid: 3278724, hjsv: 6 };
                        a = o.getElementsByTagName("head")[0];
                        r = o.createElement("script");
                        r.async = 1;
                        r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
                        a.appendChild(r);
                      })(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=");
                    `,
              }}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(e,t,o,n,p,r,i) {
                        e.visitorGlobalObjectAlias=n;
                        e[e.visitorGlobalObjectAlias]=e[e.visitorGlobalObjectAlias]||function(){
                          (e[e.visitorGlobalObjectAlias].q=e[e.visitorGlobalObjectAlias].q||[]).push(arguments)
                        };
                        e[e.visitorGlobalObjectAlias].l=(new Date).getTime();
                        r=t.createElement("script");
                        r.src=o;
                        r.async=true;
                        i=t.getElementsByTagName("script")[0];
                        i.parentNode.insertBefore(r,i)
                      })(window,document,"https://diffuser-cdn.app-us1.com/diffuser/diffuser.js","vgo");
                      vgo('setAccount', '612285146');
                      vgo('setTrackByDefault', true);
                      vgo('process');`,
              }}
            />
          </>
        )}
      </head>
      <body>
        {GTM_ID && isProduction && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{
                display: "none",
                visibility: "hidden",
              }}
            ></iframe>
          </noscript>
        )}
        <CookieConsent
          activated={activatedCookieConsent}
          url={
            "https://static.fluidity.money/assets/fluidity-privacy-policy.pdf"
          }
          callback={() => {
            localStorage.setItem("cookieConsent", "true");
            setActivatedCookieConsent(true);
          }}
        />
        <CacheProvider sha={gitSha}>
          <ToolProvider>
            <Outlet />
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </ToolProvider>
        </CacheProvider>
      </body>
    </html>
  );
}

export { ErrorBoundary };

export default withSentry(App, {
  wrapWithErrorBoundary: true,
});
