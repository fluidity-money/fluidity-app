import type { HTMLProps } from 'react';

import { DesktopOnly, GeneralButton, Heading, Row } from 'surfing';

interface IPage extends HTMLProps<HTMLDivElement> {
  title: string
}

const Page = ({ children, title, ...props }: IPage) => {
  const fluVersion = 1.5;

  return (
    <div {...props} >
      {/** Heading + Buttons*/}
      <DesktopOnly>
        <Row>
          <Heading as={"h2"}>{title}</Heading>
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
      </DesktopOnly>

      {/** Sidebar */}
      {children}
      {/** Footer */}
      <DesktopOnly>
      <Row>
        {/** General Links */}
        <div>
          <Heading as={"h6"}>
            Fluidity Money V{fluVersion}
          </Heading>
        </div>
        
        {/** Social Links */}
        <div>
          <GeneralButton 
            type={"icon only"}
          >
            Twitter
          </GeneralButton>
          <GeneralButton 
            type={"icon only"}
          >
            Discord
          </GeneralButton>
          <GeneralButton 
            type={"icon only"}
          >
            Telegram
          </GeneralButton>
          <GeneralButton 
            type={"icon only"}
          >
            LinkedIn
          </GeneralButton>
        </div>
      </Row>
      </DesktopOnly>
    </div>
  )
}

export default Page;
