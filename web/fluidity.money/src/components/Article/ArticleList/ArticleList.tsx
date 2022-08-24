// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import ArticleListCard from './ArticleListCard';
import styles from "./ArticleList.module.scss"

export interface ArticleType {
    id: number;
    title: string;
    desc: string;
    info: string;
}

export interface ArticleListProps{
    articles: ArticleType[]
}

export const ArticleList = ({articles}: ArticleListProps) => {

    const list = articles.map((article) => {
        return (
            <ArticleListCard id={article.id} title={article.title} desc={article.desc} info={article.info} />
        );
    });

    return (
        <div className={styles.listContainer}>
            {list}
        </div>
    );
};