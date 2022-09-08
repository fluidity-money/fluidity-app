// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import {
  GeneralButton,
  Heading,
  LinkButton,
  Text,
} from "@fluidity-money/surfing";
import styles from "./ArticleDisplayCard.module.scss";

export interface ArticleDisplayCardType {
  id: number;
  img: string;
  title: string;
  desc: string;
  info: string;
  isResourcesPage?: boolean;
}

const ArticleDisplayCard = (article: ArticleDisplayCardType) => {
  return (
    <div className={styles.cardContainer}>
      <img src={article.img} />
      <Heading as="h3" className={styles.leftMargin10px}>{article.title}</Heading>
      <Text as="p">{article.desc}</Text>
      <Text as="p">{article.info}</Text>
      <section>
        {article.isResourcesPage ? (
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
        ) : (
          <a href="/resources">
            <LinkButton
              type={"internal"}
              size={"medium"}
              handleClick={function (): void {}}
            >
              EXPLORE ALL RESOURCES
            </LinkButton>
          </a>
        )}
      </section>
    </div>
  );
};

export default ArticleDisplayCard;
