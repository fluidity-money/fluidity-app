import type { HTMLProps } from 'react';

import { GeneralButton } from 'surfing';

const Page = ({ children, ...props }: HTMLProps<HTMLDivElement>) => {
  return (
    <div {...props} >
      {/** Heading + Buttons*/}
      <div>
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
      </div>
      {/** Sidebar */}
      {children}
      {/** Footer */}
    </div>
  )
}

export default Page;
