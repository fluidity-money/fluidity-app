import type { HTMLProps } from 'react';

import { GeneralButton, Row, Heading } from 'surfing';

const Page = ({ children, ...props }: HTMLProps<HTMLDivElement>) => {
  const fluVersion = 1.5;

  return (
    <div {...props} >
      {/** Heading + Buttons*/}
      <Row>
        <h2>Dashboard</h2>
        {/** Button Group */}
        <div>
          <GeneralButton 
            type={"icon before"}
            version={"secondary"}
          >
            Send
          </GeneralButton>
          <GeneralButton 
            type={"icon before"}
            version={"secondary"}
          >
            Receive
          </GeneralButton>
          <GeneralButton 
            type={"text"}
            version={"primary"}
          >
            Fluidify Money
          </GeneralButton>
        </div>
      </Row>
      {/** Sidebar */}
      {children}
      {/** Footer */}
      <Row>
        {/** General Links */}
        <div>
          <Heading as={"h6"}>
            Fluidity Money V{fluVersion}
          </Heading>
        </div>
        
        {/** Social Links */}
        <div>
        </div>
      </Row>
    </div>
  )
}

export default Page;
