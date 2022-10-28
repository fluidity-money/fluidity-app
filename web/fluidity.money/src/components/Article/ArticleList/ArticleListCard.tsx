// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { Heading, Text, LinkButton } from "@fluidity-money/surfing";
import { ArticleType } from "./ArticleList";
import styles from "./ArticleList.module.scss";

const ArticleListCard = (article: ArticleType) => {
  return (
    <div className={styles.listCardContainer}>
      <a href={article.link} rel="noopener noreferrer" target="_blank">
        <Heading as="h4">{article.title}</Heading>
        <Text size="md" as="p">
          {article.desc}
        </Text>
        <section>
          {article.info}
          <LinkButton
            size={"small"}
            type={"external"}
            handleClick={() => (window.location.href = article.link)}
          >
            {article.linkTitle}
          </LinkButton>
        </section>
      </a>
      <hr />
    </div>
  );
};

export default ArticleListCard;
