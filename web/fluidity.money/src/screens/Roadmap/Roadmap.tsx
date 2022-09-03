// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import HowItWorksTemplate from "components/HowItWorksTemplate";
import useViewport from "hooks/useViewport";
import { LinkButton, ReusableGrid } from "surfing";
import styles from "./Roadmap.module.scss";

const Roadmap = () => {
  // to set order correct when in column layout
  const { width } = useViewport();
  const breakpoint = 860;

  const button = (
    <LinkButton size={"medium"} type={"external"} handleClick={() => {}}>
      EXPLORE OUR FUTURE
    </LinkButton>
  );

  const left =
    width < breakpoint ? (
      <div style={{ fontSize: 160 }}>🦍</div>
    ) : (
      <HowItWorksTemplate info={info} button={button}>
        Roadmap
      </HowItWorksTemplate>
    );

  const right =
    width > breakpoint ? (
      <div style={{ fontSize: 160 }}>🦍</div>
    ) : (
      <HowItWorksTemplate info={info} button={button}>
        Roadmap
      </HowItWorksTemplate>
    );

  return (
    <div className={styles.container} id="yield&win">
      <ReusableGrid left={left} right={right} />
    </div>
  );
};

export default Roadmap;

const info = [
  "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Explicabo sint, voluptatibus omnis modi incidunt ex possimus obcaecati soluta cum corporis alias veritatis aperiam non amet, eligendi, itaque architecto et voluptatem?",
];
