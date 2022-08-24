import { 
  AnchorButton,
  Display,
  Heading,
  LineChart,
  LinkButton,
  DataTable,
  Row,
  TabButton, 
} from 'surfing';

import Page from '../../components/page';
import { numberToMonetaryString } from '../../utils/numberConverters';

const Dashboard = () => {
  const filterOptions = ["ALL", "DEX", "NFT", "DeFi"]
  const totalTransactions = 120;
  const totalYield = 2964500;
  const totalAssets = 8;

  return (
    <Page title={"DASHBOARD"}>
      {/** Total Transactions */}
      <Row>
        <div>
          <Heading as={"h6"}>Total transactions</Heading>
          <Display>{totalTransactions}</Display>
          <AnchorButton>
            Activity
          </AnchorButton>
        </div>
        <div>
          <Heading as={"h6"}>Total yield</Heading>
          <Display>{numberToMonetaryString(totalYield)}</Display>
          <LinkButton
            size={"medium"}
            type={"internal"}
          >
            Rewards
          </LinkButton>
        </div>
        <div>
          <Heading as={"h6"}>Fluid assets</Heading>
          <Display>{totalAssets}</Display>
          <LinkButton
            size={"medium"}
            type={"internal"}
          >
            Assets
          </LinkButton>
        </div>
      {/** Graph */}
      <div>
        <TabButton>
          D
        </TabButton>
        <TabButton>
          W
        </TabButton>
        <TabButton>
          M
        </TabButton>
        <TabButton>
          Y
        </TabButton>
      </div>
      </Row>
      <LineChart />
      {/** Transactions */}
      <DataTable 
        name={"transactions"}
        filterData={filterOptions}
        columns={[
          {
            Header: 'ACTIVITY',
            accessor: 'img',
            Cell: (props: any) => (
            <>
              <img
                src={props.row.original.img}
                width={20}
                alt='coin' 
              /> 
              <span>{props.row.original.action}</span>
            </> 
            )
          },
        ]}
        data={[]}
        displayedRowSize={5}
      />
    </Page>
  )
}

export default Dashboard;