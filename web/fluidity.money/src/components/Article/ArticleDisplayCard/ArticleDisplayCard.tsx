// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import {
  Heading,
  LinkButton,
  Text,
} from "@fluidity-money/surfing";
import useViewport from "hooks/useViewport";
import Link from "next/link";
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
      <Link
        href={article.link}
        passHref
      >
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
      </Link>
      <section>
        {article.isResourcesPage ? (
          <a
            href="https://blog.fluidity.money/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <LinkButton
              type={"internal"}
              size={width < breakpoint ? "medium" : "large"}
              handleClick={function (): void {}}
            >
              ALL ARTICLES
            </LinkButton>
          </a>
        ) : (
          <Link
            href="/resources"
            passHref
          >
            <a href="/resources" rel="noopener noreferrer" target="_blank">
              <LinkButton
                type={"internal"}
                size={width < breakpoint ? "medium" : "large"}
                handleClick={function (): void {}}
              >
                EXPLORE ALL RESOURCES
              </LinkButton>
            </a>
          </Link>
        )}
      </section>
    </div>
  );
};

export default ArticleDisplayCard;
