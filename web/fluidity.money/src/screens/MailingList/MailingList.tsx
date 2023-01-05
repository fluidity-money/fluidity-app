// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { GeneralButton, Heading, Text, useViewport } from '@fluidity-money/surfing';
import { motion, useAnimation } from 'framer-motion';
import { useState } from 'react';
import styles from './MailingList.module.scss';

type FormState = `success` | `loading` | `failed` | `idle`;

const MailingList = () => {
  
  const { width } = useViewport();

  const leftIn = {
    visible: { opacity: 1, transform: "translateX(0px)", transition: { duration: 0.3 } },
    hidden: { opacity: 0, transform: width <= 620 ? "translateX(-180px)" : "translateX(-500px)" }
  };

  const control = useAnimation();
  const [state, setState] = useState<FormState>(`idle`);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    control.start("visible");

    if(state === `loading`) return;

    setState(`loading`);

    control.start("visible");

    const endpoint = "https://landing-api.fluidity.money:8081/api/submit-email";
    
    const data = `email=${e.target.email.value}`
    
    fetch(
      endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data,
        mode: 'no-cors',
      }
    )
    .then((response) => {
      control.set("hidden");

      setState(`success`);

      control.start("visible");

      e.target.email.value = "";
      e.target.name.value = "";

      setTimeout(
      ()=> {
        control.set("hidden");
        setState(`idle`);
      }, 7000);
    })
    .catch(()=>{
      control.set("hidden");

      setState(`failed`);

      control.start("visible");

      setTimeout(
      ()=> {
        control.set("hidden");
        setState(`idle`);
      }, 7000);
    });
  }

  return (
    <div className={styles.container}>
      <div>
        <Heading as="h3">Stay hydrated</Heading>
        <Text as="p" size={"lg"} >
          Subscribe to our monthly newsletter to stay up to date with our
          progress and roadmap.
        </Text>
        <motion.p className={styles.textPosition}
         animate={control}
         initial="hidden"
         variants={leftIn}
        >
          <Text 
            size={"lg"}
            className={`${styles.successText} ${state === `success` ? styles.show : styles.hide}`}
          >
           We have received your info! 🎉
          </Text>
          <Text 
            size={"lg"}
            className={`${styles.failedText} ${state === `failed` ? styles.show : styles.hide}`}
          >
           Something went wrong 😢, try again!
          </Text>
          <Text 
            size={"lg"}
            className={`${styles.loadingText} ${state === `loading` ? styles.show : styles.hide}`}
          >
           Processing you request ...
          </Text>
        </motion.p>
 
        <form id={"mailform"} onSubmit={handleSubmit}>
          <section>
            <Text size={"md"} prominent={true} >NAME</Text>
            <input type="text" placeholder="Elon" name={"name"} />
          </section>
          <section>
            <Text size={"md"} prominent={true} >EMAIL</Text>
            <input type="email" placeholder="elon@email.com" name={"email"} required />
          </section>
          <GeneralButton
            type={'submit'}
            version={"primary"}
            buttontype={"text"}
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
