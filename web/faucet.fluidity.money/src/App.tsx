// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import styled from "styled-components";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import NotificationContainer from "./components/Notifications/NotificationContainer";
import { RowCentered } from "./components/Row";
import LetsTalk from "./pages/LetsTalk";
import RequestFaucet from "./pages/RequestFaucet";

const navbarItems: [string, string][] = [
  ["Home", "https://fluidity.money"],
  ["About", "https://fluidity.money/#about"],
  ["Docs", "https://docs.fluidity.money/"],
  ["Contact", "https://fluidity.money/#lets-talk"],
  ["Blog", "https://blog.fluidity.money"],
  ["Whitepapers", "https://fluidity.money/#whitepapers"],
];

// {[k: network]: [display name, value to use in request, [supported tokens]]}
export type NetworkInputOptions = typeof networkInputOptions;
const networkInputOptions = {
  ethereum: [
    "Ethereum Ropsten",
    "0x0000000000000000000000000000",
    ["fUSDC", "fDAI"],
  ]
} as const;

const App = () => (
  <NotificationContainer>
    <Container>
      <section id="#navbar">
        <Navbar items={navbarItems} />
      </section>

      <Container>
        <section id="#request-faucet">
          <RequestFaucet networkInputOptions={networkInputOptions} />
        </section>

        <section id="#lets talk">
          <RowCentered>
            <LetsTalk />
          </RowCentered>
        </section>
      </Container>
      <Footer />
    </Container>
  </NotificationContainer>
);

const Container = styled.div``;

export default App;
