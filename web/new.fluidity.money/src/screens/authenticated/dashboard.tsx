import { 
  AnchorButton,
  LineChart,
  DataTable,
  TabButton 
} from 'surfing';

import Page from '../../components/page';

enum DataFilterOptions {
  Dex = "DEX",
  Nft = "NFT",
  Defi = "DeFi",
}

const Dashboard = () => {
  const filterOptions = ["ALL", "DEX", "NFT", "DeFi"]
  return (
    <Page>
      {/** Total Transactions */}
      {/** Flex wrap group */}
      <div>
        <div>
          <AnchorButton>
            Activity
          </AnchorButton>
        </div>
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
      <LineChart />
      {/** Transactions */}
      {/** name, filterData = [], columns, data, displayedRowSize */}
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
        data={}
        displayedRowSize={5}
      />
    </Page>
  )
}

export default Dashboard;