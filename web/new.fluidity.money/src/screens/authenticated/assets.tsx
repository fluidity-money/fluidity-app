import Page from '../../components/page';
import { numberToMonetaryString } from '../../utils/numberConverters';

import { Display, Heading, Row, TabButton } from 'surfing';

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
          <TabButton>
            All
          </TabButton>
          <TabButton>
            Protocols
          </TabButton>
          <TabButton>
            Pools
          </TabButton>
      </Row>
      {/** Provide Liquidity */}
    </Page>
  )
}

export default Assets;