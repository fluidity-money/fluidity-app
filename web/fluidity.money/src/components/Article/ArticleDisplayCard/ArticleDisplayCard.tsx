// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import {
  GeneralButton,
  Heading,
  LinkButton,
  Text,
} from "@fluidity-money/surfing";
import useViewport from "hooks/useViewport";
import styles from "./ArticleDisplayCard.module.scss";

export interface ArticleDisplayCardType {
  id: number;
  img: string;
  title: string;
  desc: string;
  info: string;
  link: string;
  isResourcesPage?: boolean;
}

const ArticleDisplayCard = (article: ArticleDisplayCardType) => {
  const { width } = useViewport();
  const breakpoint = 860;

  return (
    <div className={styles.cardContainer}>
      <a href={article.link}>
        <img src={article.img} alt="Article-Image"/>
        <Heading as="h4" className={styles.leftMargin10px}>
          {article.title}
        </Heading>
        <Text size="md" as="p">
          {article.desc}
        </Text>
        <Text size="md" as="p">
          {article.info}
        </Text>
      </a>
      <section>
        {article.isResourcesPage ? (
          <a href="https://blog.fluidity.money/">
            <LinkButton
              type={"internal"}
              size={width < breakpoint ? "medium" : "large"}
              handleClick={function (): void {}}
            >
              ALL ARTICLES
            </LinkButton>
          </a>
        ) : (
          <a href="/resources">
            <LinkButton
              type={"internal"}
              size={width < breakpoint ? "medium" : "large"}
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
