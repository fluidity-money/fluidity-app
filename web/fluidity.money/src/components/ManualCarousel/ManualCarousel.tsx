// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import React, { ReactNode } from "react";
import styles from "./ManualCarousel.module.scss";

interface ICarouselProps {
  children: ReactNode;
}

const ManualCarousel = ({ children }: ICarouselProps) => {
  /* carousel that displays mapped content as children with scrollbar below,
  to ensure spacing between scrollbar and content, add margin-bottom:50px 
  potential to upgrade with separate scrollbar component that is more
  customisable and easier to position
  */
  return (
    <div className={styles.container}>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default ManualCarousel;
