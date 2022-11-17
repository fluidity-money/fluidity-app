import path from "path";
import express from "express";
import compression from "compression";
import morgan from "morgan";
import { wrapExpressCreateRequestHandler } from "@sentry/remix";
import { createRequestHandler } from "@remix-run/express";

import { Server } from "socket.io";

import { createServer } from "http";

import config from "~/webapp.config.server";
import { Observable, Subscription } from "rxjs";
import { PipedTransaction } from "drivers/types";
import {
  getObservableForAddress,
  getTransactionsObservableForIn,
  getHasuraTransactionObservable,
} from "./drivers";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const createSentryRequestHandler =
  wrapExpressCreateRequestHandler(createRequestHandler);

app.use((req, res, next) => {
  // helpful headers:
  res.set("Strict-Transport-Security", `max-age=${60 * 60 * 24 * 365 * 100}`);

  // /clean-urls/ -> /clean-urls
  if (req.path.endsWith("/") && req.path.length > 1) {
    const query = req.url.slice(req.path.length);
    const safepath = req.path.slice(0, -1).replace(/\/+/g, "/");
    res.redirect(301, safepath + query);
    return;
  }
  next();
});

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// Remix fingerprints its assets so we can cache forever.
app.use(
  "/build",
  express.static("public/build", { immutable: true, maxAge: "1y" })
);

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("public", { maxAge: "1h" }));

app.use(morgan("tiny"));

const MODE = process.env.NODE_ENV;
const BUILD_DIR = path.join(process.cwd(), "build");

const ethereumTokens = config.config["ethereum"].tokens
  .filter((entry) => entry.isFluidOf !== undefined)
  .map((entry) => ({
    token: entry.symbol,
    address: entry.address,
  }));

const solanaTokens = config.config["solana"].tokens
  .filter((entry) => entry.isFluidOf !== undefined)
  .map((entry) => ({
    token: entry.symbol,
    address: entry.address,
  }));

const hasuraUrl = config.database.hasura;
const registry = new Map<string, Subscription>();

io.on("connection", (socket) => {
  socket.on("subscribeTransactions", ({ protocol, address }) => {
    if (registry.has(socket.id)) registry.get(socket.id)?.unsubscribe();

    let Tokens: {
      token: string;
      address: string;
    }[] = [];

    if (protocol === `ethereum`) {
      Tokens = ethereumTokens;
    } else if (protocol === `solana`) {
      Tokens = solanaTokens;
    }

    const OnChainTransactionsObservable: Observable<PipedTransaction> =
      getTransactionsObservableForIn(protocol, {}, ...Tokens);

    const DbTransactionsObservable: Observable<PipedTransaction> =
      getHasuraTransactionObservable(hasuraUrl, address);

    const OnChainTransactionFilterObservable = getObservableForAddress(
      OnChainTransactionsObservable,
      address
    );

    registry.set(
      socket.id,
      OnChainTransactionFilterObservable.subscribe((transaction) => {
        socket.emit("Transactions", transaction);
      })
    );

    DbTransactionsObservable.subscribe({
      next(data) {
        socket.emit("Transactions", data);
      },
      error(err) {
        console.error("something has gone wrong " + err);
        //handle exception - later
      },
    });
  });

  socket.on("disconnect", () => {
    registry.get(socket.id)?.unsubscribe();
    registry.delete(socket.id);
  });
});

app.all(
  "*",
  MODE === "production"
    ? createSentryRequestHandler({ build: require(BUILD_DIR) })
    : (...args) => {
        purgeRequireCache();
        const requestHandler = createRequestHandler({
          build: require(BUILD_DIR),
          mode: MODE,
        });
        return requestHandler(...args);
      }
);

const port = process.env.PORT || 3000;

httpServer.listen(port, () => {
  // require the built app so we're ready when the first request comes in
  require(BUILD_DIR);
  console.log(`✅ app ready: http://localhost:${port}`);
});

function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, we prefer the DX of this though, so we've included it
  // for you by default
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete require.cache[key];
    }
  }
}
