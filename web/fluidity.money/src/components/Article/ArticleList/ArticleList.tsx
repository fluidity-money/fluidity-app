import React from 'react'
import ArticleListCard from './ArticleListCard';

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
        <div style={{margin: "40px 40px 0px 0px", maxHeight: "550px", overflowY: "scroll"}}>
            {list}
        </div>
    );
};