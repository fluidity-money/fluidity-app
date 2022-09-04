// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { GeneralButton } from "surfing";
import styles from "./ArticleDisplayCard.module.scss";

export interface ArticleDisplayCardType {
  id: number;
  img: string;
  title: string;
  desc: string;
  info: string;
}

const ArticleDisplayCard = (article: ArticleDisplayCardType) => {
  return (
    <div className={styles.cardContainer}>
      <img src={article.img} />
      <h2>{article.title}</h2>
      <p>{article.desc}</p>
      <p>{article.info}</p>
      <section>
        <a href="https://blog.fluidity.money/">
          <GeneralButton
            version={"secondary"}
            type={"text"}
            size={"medium"}
            handleClick={function (): void {}}
          >
            ALL ARTICLES
          </GeneralButton>
        </a>
      </section>
    </div>
  );
};

export default ArticleDisplayCard;
