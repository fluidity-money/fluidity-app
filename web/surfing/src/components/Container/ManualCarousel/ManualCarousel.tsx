// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { ReactNode } from "react";
import styles from "./ManualCarousel.module.scss";

interface ICarouselProps {
  children: ReactNode;
  scrollBar?: boolean;
  className?: string;
}

const ManualCarousel = ({
  children,
  scrollBar,
  className,
  ...props
}: ICarouselProps) => {
  /* carousel that displays mapped content as children with scrollbar below,
  to ensure spacing between scrollbar and content, add margin-bottom:50px 
  potential to upgrade with separate scrollbar component that is more
  customisable and easier to position
  */
  return (
    <div {...props} className={styles.container}>
      <div
        className={`${scrollBar ? styles.content : styles.hidden} ${
          className || ""
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default ManualCarousel;
