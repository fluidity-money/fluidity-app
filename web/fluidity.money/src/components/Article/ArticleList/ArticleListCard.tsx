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