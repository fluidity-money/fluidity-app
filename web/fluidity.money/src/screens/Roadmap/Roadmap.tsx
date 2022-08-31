// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { ReusableGrid } from "surfing";
import styles from "./Roadmap.module.scss";

const Roadmap = () => {
  return (
    <div className={styles.container}>
      <ReusableGrid
        left={<h1>Roadmap</h1>}
        right={<div style={{ fontSize: 160 }}>🦍</div>}
      />
    </div>
  );
};

export default Roadmap;
