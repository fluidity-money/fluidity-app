
import styled from "styled-components";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import NotificationContainer from "./components/Notifications/NotificationContainer";
import {RowCentered} from "./components/Row";
import LetsTalk from "./pages/LetsTalk";
import RequestFaucet from "./pages/RequestFaucet";



const navbarItems : [string, string][] = [
  [ "Home", "https://fluidity.money" ],
  [ "About", "https://fluidity.money/#about" ],
  [ "Contact", "https://fluidity.money/#lets-talk" ],
  [ "Blog", "https://blog.fluidity.money" ],
  [ "Whitepapers", "https://fluidity.money/#whitepapers" ]
];

// [[display name, value to use in request], ...]
const networkInputOptions : [name: string, value: string][] = [
  [ "Ethereum Ropsten", "ethereum" ]
];

const App = () =>
  <NotificationContainer>
    <Container>
      <section id="#navbar">
        <Navbar items={ navbarItems } />
      </section>

      <Container>
        <section id="#request-faucet">
          <RequestFaucet
            networkInputOptions={ networkInputOptions }
          />
        </section>

        <section id="#lets-talk">
          <RowCentered><LetsTalk/></RowCentered>
        </section>
      </Container>
    </Container>;
  </NotificationContainer>

const Container = styled.div`

`;

export default App;
