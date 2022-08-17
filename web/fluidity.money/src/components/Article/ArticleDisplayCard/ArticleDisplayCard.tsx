import { TextButton } from "../../Button";

export interface ArticleDisplayCardType {
  id: number;
  img: string;
  title: string;
  desc: string;
  info: string;
}

const ArticleDisplayCard = (article: ArticleDisplayCardType) => {

    return (
        <div style={{width: "80%", height:  "100%", border: "1px red solid", padding: "40px 40px 40px 40px", marginRight: "40px"}}>
        <div style={{width: "100%", height:  "350px", border: "1px red solid", margin:"10px 10px 10px 10px"}}>
        <img  style={{width: "100%", height: "100%"}} src={article.img}/>
        </div>
        <h1>{article.title}</h1>
        <p>
         {article.desc}
        </p>
        <p>{article.info} min read ARTICLE</p>
        <TextButton colour="coloured">ALL ARTICLES</TextButton>
    </div>
    );
};

export default ArticleDisplayCard;