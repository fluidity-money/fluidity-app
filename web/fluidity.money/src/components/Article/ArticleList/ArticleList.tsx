// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import ArticleListCard from "./ArticleListCard";
import styles from "./ArticleList.module.scss";

export interface ArticleType {
  id: number;
  title: string;
  desc: string;
  info: string;
  link: string;
  linkTitle: string;
}

export interface ArticleListProps {
  articles: ArticleType[];
}

export const ArticleList = ({ articles }: ArticleListProps) => {
  const list = articles.map((article, i) => {
    return (
      <ArticleListCard
        key={`article-${i}`}
        id={article.id}
        title={article.title}
        desc={article.desc}
        info={article.info}
        link={article.link}
        linkTitle={article.linkTitle}
      />
    );
  });

  return <div className={styles.listContainer}>{list}</div>;
};
