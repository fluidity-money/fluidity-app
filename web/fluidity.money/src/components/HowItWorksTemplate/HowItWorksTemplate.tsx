// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import styles from "./HowItWorksTemplate.module.scss";

interface ITemplateProps {
  children: string;
  header?: string;
  button?: any;
  info: string[];
}

const HowItWorksTemplate = ({
  children,
  header,
  info,
  button,
}: ITemplateProps) => {
  return (
    <div className={styles.content}>
      <h1>{children}</h1>
      <h2>{header}</h2>
      {info.map((paragraph, i) => (
        <p key={`para-${i}`}>{paragraph}</p>
      ))}
      {button}
    </div>
  );
};

export default HowItWorksTemplate;
