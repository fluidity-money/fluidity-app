import React from 'react'
import { ArticleType } from "./ArticleLists";

import { TextButton } from "../../Button";

const ArticleListCard = (article: ArticleType) => {

    return (
        <div style={{margin: "0px 0 0 10px"}}>
            <h1 style={{marginBottom: "10px"}}>{article.title}</h1>
            <p style={{marginBottom: "10px"}}>
            {article.desc}
            </p>
            <p style={{marginBottom: "10px"}}>{article.info}</p>
            <hr />
       </div>
    );
};

export default ArticleListCard;