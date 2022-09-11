// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.
import React, { useEffect, useState } from "react";
import { Navigation } from "@fluidity-money/surfing";
import ResourcesPageTitle from "screens/ResourcesPageTitle";
import Articles from "../../screens/Articles";
import Contact from "../../screens/Contact";
import Demo from "../../screens/Demo";
import Docs from "../../screens/Docs";
import Fluniversity from "../../screens/Fluniversity";
import Footer from "../../screens/Footer";
import Hero from "../../screens/Hero";
import Introducing from "../../screens/Introducing";
import Tweets from "../../screens/Tweets";
import Whitepapers from "../../screens/Whitepapers";
import styles from "./ResourcesPage.module.scss";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

const ResourcesPage = () => {
  const [introVisible, setIntroVisibility] = useState(true);
  const [pageVisible, setpageVisibility] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIntroVisibility(false);
      setpageVisibility(true);
    }, 800);
  }, []);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.screensContainer}>
        <Navigation
          page={"resources"}
          pageLocations={pageLocations}
          background={"black"}
        />
        <AnimatePresence initial={false}>
          {introVisible && (
            <motion.div
              animate={{ opacity: 1 }}
              transition={{ transform: { duration: 1.6 } }}
              exit={{ opacity: 0.2 }}
            >
              <ResourcesPageTitle />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {pageVisible && (
            <motion.div
              initial={{ opacity: 0.1, transform: "translateY(300px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              transition={{ transform: { duration: 1 } }}
            >
              <Articles isResourcesPage={true}/>
              {/* <Tweets /> */}
              <Fluniversity />
              <Whitepapers />
              <Docs />
              <Demo />
              <Footer />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResourcesPage;

const pageLocations = [
  "articles",
  "fluniversity",
  "whitepapers",
  "documentation",
];
