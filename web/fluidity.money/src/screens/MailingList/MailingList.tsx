// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { GeneralButton, Heading, Text } from '@fluidity-money/surfing';
import styles from './MailingList.module.scss';

const MailingList = () => {

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const endpoint = "https://landing-api.fluidity.money:8081/api/submit-email";
    
    const data = `email=${e.target.email.value}`
    e.target.email.value = "";
    e.target.name.value = "";
    
    fetch(
      endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data,
        mode: 'no-cors',
      }
    );
  }

  return (
    <div className={styles.container}>
      <div>
        <Heading as="h3">Stay hydrated</Heading>
        <Text as="p" size={"lg"} >
          Subscribe to our monthly newsletter to stay up to date with our
          progress and roadmap.
        </Text>
        <form id={"mailform"} onSubmit={handleSubmit}>
          <section>
            <Text size={"md"} prominent={true} >NAME</Text>
            <input type="text" placeholder="Elon" name={"name"} />
          </section>
          <section>
            <Text size={"md"} prominent={true} >EMAIL</Text>
            <input type="text" placeholder="elon@email.com" name={"email"} />
          </section>
          <GeneralButton
            type={'submit'}
            version={"primary"}
            buttonType={"text"}
            size={"medium"}
            handleClick={()=>{}}
          >
            GIMME THE JUICE
          </GeneralButton>
        </form>
      </div>
    </div>
  );
}

export default MailingList;
