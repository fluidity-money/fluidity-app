// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { ArticleType } from "./ArticleList";
import styles from "./ArticleList.module.scss"
import { TextButton } from "../../Button";

const ArticleListCard = (article: ArticleType) => {

    return (
        <div className={styles.listCardContainer}>
            <h2>{article.title}</h2>
            <p>
                {article.desc}
            </p>
            <section>{article.info}</section>
            <hr />
       </div>
    );
};

export default ArticleListCard;