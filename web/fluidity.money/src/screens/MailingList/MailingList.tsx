// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { GeneralButton, Heading, Text } from '@fluidity-money/surfing';
import styles from './MailingList.module.scss';

const MailingList = () => (
  <div className={styles.container}>
    <div>
      <Heading as="h3">Stay hydrated</Heading>
      <Text as="p" size={"lg"} >
        Subscribe to our monthly newsletter to stay up to date with our
        progress and roadmap.
      </Text>
      <form>
        <section>
          <Text size={"md"} prominent={true} >NAME</Text>
          <input type="text" placeholder="Elon" />
        </section>
        <section>
          <Text size={"md"} prominent={true} >EMAIL</Text>
          <input type="text" placeholder="elon@email.com" />
        </section>
        <GeneralButton
          version={"primary"}
          buttonType={"text"}
          size={"medium"}
          handleClick={function (): void {
            throw new Error("Function not implemented.");
          }}
        >
          GIMME THE JUICE
        </GeneralButton>
      </form>
    </div>
  </div>
);

export default MailingList;
