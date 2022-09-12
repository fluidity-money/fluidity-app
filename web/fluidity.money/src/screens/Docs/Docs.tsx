// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  ContinuousCarousel,
  ManualCarousel,
  GeneralButton,
  Heading,
  Text,
} from "@fluidity-money/surfing";
import styles from "./Docs.module.scss";

const Docs = () => {
  /* scrolls to location on pageload if it contains same ID or scrolls to the top
   for ResourcesNavModal to work*/
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      let elem = document.getElementById(location.hash.slice(1));
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [location]);

  const callout = (
    <div className={styles.callout}>
      <Heading hollow={true} as="h4" className={styles.text}>
        DOCUMENTATION DOCUMENTATION
      </Heading>
      <Heading as="h4" className={styles.text}>
        DOCUMENTATION
      </Heading>
    </div>
  );

  return (
    <div id="documentation">
      <div className={styles.carousel}>
        <ContinuousCarousel direction={"right"}>
          <div>
            {callout}
            {callout}
            {callout}
            {callout}
            {callout}
            {callout}
            {callout}
            {callout}
            {callout}
            {callout}
            {callout}
          </div>
        </ContinuousCarousel>
      </div>
      <div className={styles.container}>
        <ManualCarousel>
          {items.map((item, index) => (
            <div key={index} className={styles.docsCard}>
              <div className={styles.imgContainer}>
                <img src={item.img} />
              </div>
              <Heading as="h3">{item.title}</Heading>
              <a href={item.link}>
                DOCS <i>*</i>
              </a>
            </div>
          ))}
        </ManualCarousel>
      </div>
      <div className={styles.desktopViewFormInput}>
        <Heading as="h4">Stay hydrated</Heading>
        <Heading as="h6">EMAIL</Heading>
        <div>
          <input type="text" placeholder="elon@email.com" />
          <GeneralButton
            version={"secondary"}
            buttonType={"text"}
            size={"medium"}
            handleClick={function (): void {
              throw new Error("Function not implemented.");
            }}
          >
            GIMME THE JUICE
          </GeneralButton>
        </div>
      </div>
      <div className={styles.mobileViewFormInput}>
        <div>
          <Heading as="h3">Stay hydrated</Heading>
          <Text as="p">
            Subscribe to our monthly newsletter to stay up to date with our
            progress and roadmap.
          </Text>
          <form>
            <div>
              <label>Name</label>
              <input type="text" placeholder="Elon" />
              <label>Email</label>
              <input type="text" placeholder="elon@email.com" />
            </div>
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
    </div>
  );
};

export default Docs;

const items = [
  {
    img: "https://www.gitbook.com/cdn-cgi/image/height=40,fit=contain,dpr=2,format=auto/https%3A%2F%2F3930547829-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252Fx4yhCpDhoCMNHh5hnFdg%252Flogo%252FdHNKzwEpKSmAvvwCKjPf%252FNEW%2520GRADIENT%2520WHITE%2520BACKGROUND%2520LOGO%2520FLUIDITY.png.png%3Falt%3Dmedia%26token%3D1d36671f-70f0-4059-8bfb-dfd1abbcac53",
    title: "Why Fluidity?",
    link: "https://docs.fluidity.money/docs/learning-and-getting-started/why-fluidity",
  },
  {
    img: "https://www.gitbook.com/cdn-cgi/image/height=40,fit=contain,dpr=2,format=auto/https%3A%2F%2F3930547829-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252Fx4yhCpDhoCMNHh5hnFdg%252Flogo%252FdHNKzwEpKSmAvvwCKjPf%252FNEW%2520GRADIENT%2520WHITE%2520BACKGROUND%2520LOGO%2520FLUIDITY.png.png%3Falt%3Dmedia%26token%3D1d36671f-70f0-4059-8bfb-dfd1abbcac53",
    title: "What are Fluid Assets?",
    link: "https://docs.fluidity.money/docs/learning-and-getting-started/what-are-fluid-assets",
  },
  {
    img: "https://www.gitbook.com/cdn-cgi/image/height=40,fit=contain,dpr=2,format=auto/https%3A%2F%2F3930547829-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252Fx4yhCpDhoCMNHh5hnFdg%252Flogo%252FdHNKzwEpKSmAvvwCKjPf%252FNEW%2520GRADIENT%2520WHITE%2520BACKGROUND%2520LOGO%2520FLUIDITY.png.png%3Falt%3Dmedia%26token%3D1d36671f-70f0-4059-8bfb-dfd1abbcac53",
    title: "How do you get a Fluid Asset?",
    link: "https://docs.fluidity.money/docs/learning-and-getting-started/how-do-you-get-a-fluid-asset",
  },
  {
    img: "https://www.gitbook.com/cdn-cgi/image/height=40,fit=contain,dpr=2,format=auto/https%3A%2F%2F3930547829-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252Fx4yhCpDhoCMNHh5hnFdg%252Flogo%252FdHNKzwEpKSmAvvwCKjPf%252FNEW%2520GRADIENT%2520WHITE%2520BACKGROUND%2520LOGO%2520FLUIDITY.png.png%3Falt%3Dmedia%26token%3D1d36671f-70f0-4059-8bfb-dfd1abbcac53",
    title: "How are the rewards earned?",
    link: "https://docs.fluidity.money/docs/learning-and-getting-started/how-are-the-rewards-earned",
  },
  {
    img: "https://www.gitbook.com/cdn-cgi/image/height=40,fit=contain,dpr=2,format=auto/https%3A%2F%2F3930547829-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252Fx4yhCpDhoCMNHh5hnFdg%252Flogo%252FdHNKzwEpKSmAvvwCKjPf%252FNEW%2520GRADIENT%2520WHITE%2520BACKGROUND%2520LOGO%2520FLUIDITY.png.png%3Falt%3Dmedia%26token%3D1d36671f-70f0-4059-8bfb-dfd1abbcac53",
    title: "The Economics of a Fluid Asset",
    link: "https://docs.fluidity.money/docs/learning-and-getting-started/the-economics-of-a-fluid-asset",
  },
];
