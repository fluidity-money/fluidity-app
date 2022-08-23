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