import Page from '../../components/page';
import { numberToMonetaryString } from '../../utils/numberConverters';

import { Container, Display, Heading, Row, TabButton } from 'surfing';

const Assets = () => {
  const totalBalance = 100000;

  return (
    <Page title={"ASSETS"}>
      {/** Total Balance + Tabs */}
      <Row>
        <div>
          <Heading as={"h6"}>Total Balance</Heading>
          <Display>{numberToMonetaryString(totalBalance)}</Display>
        </div>

        <div>
          <TabButton>
            Fluid Assets
          </TabButton>
          <TabButton>
            Fluid Assets
          </TabButton>
        </div>
      </Row>
      {/** Dropdown Panels */}
      {/** Highest Rewarders */}
      <Row>
        <Heading>Highest Rewarders</Heading>
        <div>
          <TabButton>
            All
          </TabButton>
          <TabButton>
            Protocols
          </TabButton>
          <TabButton>
            Pools
          </TabButton>
        </div>
      </Row>

      {/** Provide Liquidity */}
      <Container
        component={"div"}
        rounded={true}
        type={"box"}
      >
        <div>
          <Heading>Provide Liquidity</Heading>
          <Heading as={"h6"}>Make your assets work harder for your rewards. Get involved.</Heading>
          {/** Integrations */}
          <div>
            
          </div>
        </div>
        {/** Logo */}
        <div>
        </div>
      </Container>
    </Page>
  )
}

export default Assets;