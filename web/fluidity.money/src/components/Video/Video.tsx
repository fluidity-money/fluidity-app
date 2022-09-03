// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import styles from "./Video.module.scss"

interface IPropsVideo {
    src: string;
}
  
export const Video = ({src}: IPropsVideo) => {
    let ext = src.split('.').pop();
    return (
          <video  autoPlay muted loop className={styles.videoContainer}>
           <source src={src} type={'video/' + ext}/>
          </video>
    );
};

export default Video;