// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import Page from '../../components/page';
import { numberToMonetaryString } from '../../utils/numberConverters';

import { Card, Display, Heading, Row, TabButton } from 'surfing';

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
      <Card
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
      </Card>
    </Page>
  )
}

export default Assets;