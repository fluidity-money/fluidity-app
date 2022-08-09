import React from 'react'


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
               <div style={{margin: "0px 0 0 10px"}}>
                    <h1 style={{marginBottom: "10px"}}>{article.title}</h1>
                    <p style={{marginBottom: "10px"}}>
                     {article.desc}
                    </p>
                    <p style={{marginBottom: "10px"}}>{article.info}</p>
                    <hr />
              </div>
        );
    });

    return (
        <div style={{margin: "40px 40px 0px 0px", maxHeight: "550px", overflowY: "scroll"}}>
            {list}
        </div>
    );
};