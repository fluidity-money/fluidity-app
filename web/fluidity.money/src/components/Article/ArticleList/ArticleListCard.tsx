// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { Heading, Text } from "@fluidity-money/surfing";
import { ArticleType } from "./ArticleList";
import styles from "./ArticleList.module.scss";

const ArticleListCard = (article: ArticleType) => {
  return (
    <div className={styles.listCardContainer}>
      <Heading as="h4">{article.title}</Heading>
      <Text as="p">{article.desc}</Text>
      <section>{article.info}</section>
      <hr />
    </div>
  );
};

export default ArticleListCard;
